import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { useAssignors } from '@/application/assignors/useAssignors';
import { useCreateReceivable } from '@/application/receivables/useCreateReceivable';
import { useSimulateReceivable } from '@/application/receivables/useSimulateReceivable';
import { useExecuteSettlement } from '@/application/settlements/useExecuteSettlement';
import { useDebounce } from '@/lib/useDebounce';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import {
  Currency,
  CURRENCY_LABELS,
  ReceivableType,
  RECEIVABLE_TYPE_LABELS,
  SPREAD_BY_TYPE,
} from '@/domain/value-objects/enums';

// ─── Schema ──────────────────────────────────────────────────────────────────
const createSchema = z.object({
  assignorId: z.string().min(1, 'Selecione um cedente'),
  type: z.enum(['DUPLICATA', 'POST_DATED_CHECK']),
  faceValue: z
    .string()
    .min(1, 'Informe o valor')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser maior que zero'),
  assetCurrency: z.enum(['BRL', 'USD', 'EUR']),
  paymentCurrency: z.enum(['BRL', 'USD', 'EUR']),
  maturityDate: z.string().min(1, 'Informe o vencimento'),
  termMonths: z
    .string()
    .min(1, 'Informe o prazo')
    .refine((v) => Number.isInteger(parseFloat(v)) && parseFloat(v) > 0, 'Deve ser inteiro positivo'),
});

type CreateFormValues = z.infer<typeof createSchema>;

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
  onReceivableCreated?: (id: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
        {step}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</span>
    </div>
  );
}

function PanelDivider() {
  return <div className="border-t border-dashed border-gray-200 my-4" />;
}

function SimRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function OperatorPanel({ onReceivableCreated }: Props) {
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [baseRateInput, setBaseRateInput] = useState('');
  const [settlementDone, setSettlementDone] = useState(false);

  const debouncedBaseRate = useDebounce(baseRateInput, 600);
  const numericRate =
    debouncedBaseRate !== '' && !isNaN(parseFloat(debouncedBaseRate))
      ? parseFloat(debouncedBaseRate) / 100
      : null;

  const { assignors } = useAssignors();
  const { createReceivable, isPending: creating } = useCreateReceivable();
  const { simulation, isFetching: simulating } = useSimulateReceivable(createdId, numericRate);
  const { executeSettlement, isPending: settling, settlement } = useExecuteSettlement();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      assetCurrency: 'BRL',
      paymentCurrency: 'BRL',
      type: 'DUPLICATA',
    },
  });

  const selectedType = watch('type') as ReceivableType;

  async function onSubmit(values: CreateFormValues) {
    const receivable = await createReceivable({
      assignorId: values.assignorId,
      type: values.type as ReceivableType,
      faceValue: parseFloat(values.faceValue),
      assetCurrency: values.assetCurrency as typeof Currency[keyof typeof Currency],
      paymentCurrency: values.paymentCurrency as typeof Currency[keyof typeof Currency],
      maturityDate: values.maturityDate,
      termMonths: parseInt(values.termMonths, 10),
    });
    setCreatedId(receivable.id);
    onReceivableCreated?.(receivable.id);
  }

  async function handleSettle() {
    if (!createdId || numericRate === null) return;
    await executeSettlement({ receivableId: createdId, baseRate: numericRate });
    setSettlementDone(true);
  }

  function handleReset() {
    setCreatedId(null);
    setBaseRateInput('');
    setSettlementDone(false);
    reset();
  }

  // ─── Step 2: Simulation & Settlement ─────────────────────────────────────
  if (createdId && !settlementDone) {
    return (
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Voltar ao formulário"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="font-semibold text-gray-900">Simulação de Valor Presente</h3>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2.5 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3">
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand-500 flex items-center justify-center text-white text-[9px] font-bold">
            i
          </div>
          <p className="text-sm text-brand-700">
            Recebível criado. Informe a taxa base para calcular o valor líquido.
          </p>
        </div>

        {/* Base Rate Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
            <span>Taxa Base (% a.a.)</span>
            {selectedType && (
              <span className="text-xs font-normal text-gray-400 bg-gray-100 rounded-md px-2 py-0.5">
                Spread: {formatPercent(SPREAD_BY_TYPE[selectedType])}
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="ex: 13,25"
            value={baseRateInput}
            onChange={(e) => setBaseRateInput(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Simulation Card */}
        {(simulating || simulation) && (
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Simulação</p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              {simulating ? (
                <div className="flex items-center gap-2.5 text-sm text-gray-400 py-2">
                  <Spinner size="sm" />
                  <span>Calculando valor presente…</span>
                </div>
              ) : simulation ? (
                <>
                  <SimRow label="Valor de Face" value={formatCurrency(simulation.faceValue, simulation.assetCurrency)} />
                  <SimRow label="Taxa Base" value={formatPercent(simulation.baseRate)} />
                  <SimRow label="Spread" value={formatPercent(simulation.spread)} />
                  <SimRow label="Prazo" value={`${simulation.termMonths} meses`} />
                  {simulation.exchangeRateUsed && (
                    <SimRow label="Câmbio utilizado" value={simulation.exchangeRateUsed.toFixed(4)} />
                  )}
                </>
              ) : null}
            </div>
            {simulation && !simulating && (
              <div className="mx-3 mb-3 rounded-lg bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-medium text-brand-200">Valor Líquido</span>
                <span className="text-base font-bold text-white">
                  {simulation.presentValueConverted
                    ? formatCurrency(simulation.presentValueConverted, simulation.paymentCurrency)
                    : formatCurrency(simulation.presentValue, simulation.assetCurrency)}
                </span>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleSettle}
          loading={settling}
          disabled={!simulation || simulating || settling}
          className="w-full"
        >
          Executar Liquidação
        </Button>
      </div>
    );
  }

  // ─── Step 3: Settlement done ──────────────────────────────────────────────
  if (settlementDone && settlement) {
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
          <CheckCircle className="h-9 w-9 text-emerald-500" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-base">Liquidação Realizada!</p>
          <p className="text-sm text-gray-500 mt-1">Operação concluída com sucesso</p>
        </div>
        <div className="w-full rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">
            Valor Líquido
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            {settlement.presentValueConverted
              ? formatCurrency(settlement.presentValueConverted, settlement.paymentCurrency)
              : formatCurrency(settlement.presentValue, settlement.assetCurrency)}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleReset} className="w-full">
          Nova Operação
        </Button>
      </div>
    );
  }

  // ─── Step 1: Create Form ─────────────────────────────────────────────────
  const assignorOptions = assignors
    .filter((a) => a.active)
    .map((a) => ({ value: a.id, label: `${a.name} — ${a.document}` }));

  const typeOptions = Object.values(ReceivableType).map((t) => ({
    value: t,
    label: RECEIVABLE_TYPE_LABELS[t],
  }));

  const currencyOptions = Object.values(Currency).map((c) => ({
    value: c,
    label: CURRENCY_LABELS[c],
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" noValidate>
      {/* Section 1 */}
      <div className="pb-1">
        <SectionLabel step={1} title="Identificação" />
        <div className="space-y-3">
          <Select
            label="Cedente"
            placeholder="Selecione o cedente"
            options={assignorOptions}
            error={errors.assignorId?.message}
            {...register('assignorId')}
          />
          <Select
            label="Tipo de Recebível"
            options={typeOptions}
            error={errors.type?.message}
            {...register('type')}
          />
        </div>
      </div>

      <PanelDivider />

      {/* Section 2 */}
      <div className="pb-1">
        <SectionLabel step={2} title="Dados Financeiros" />
        <div className="space-y-3">
          <Input
            label="Valor de Face"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            error={errors.faceValue?.message}
            {...register('faceValue')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Moeda do Ativo"
              options={currencyOptions}
              error={errors.assetCurrency?.message}
              {...register('assetCurrency')}
            />
            <Select
              label="Moeda Pgto."
              options={currencyOptions}
              error={errors.paymentCurrency?.message}
              {...register('paymentCurrency')}
            />
          </div>
        </div>
      </div>

      <PanelDivider />

      {/* Section 3 */}
      <div className="pb-1">
        <SectionLabel step={3} title="Vencimento e Prazo" />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Vencimento"
            type="date"
            error={errors.maturityDate?.message}
            {...register('maturityDate')}
          />
          <Input
            label="Prazo (meses)"
            type="number"
            min="1"
            step="1"
            placeholder="12"
            error={errors.termMonths?.message}
            {...register('termMonths')}
          />
        </div>
      </div>

      <div className="mt-5">
        <Button type="submit" loading={creating} className="w-full">
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registrando…
            </>
          ) : (
            'Registrar Recebível'
          )}
        </Button>
      </div>
    </form>
  );
}
