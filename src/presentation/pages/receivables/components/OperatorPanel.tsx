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
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Voltar ao formulário"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="font-semibold text-gray-900">Simulação de Valor Presente</h3>
        </div>

        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Recebível criado. Informe a taxa base para calcular o valor líquido.
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Taxa Base (% a.a.)
            {selectedType && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                Spread: {formatPercent(SPREAD_BY_TYPE[selectedType])}
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="ex: 13.25"
            value={baseRateInput}
            onChange={(e) => setBaseRateInput(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {(simulating || simulation) && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            {simulating ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Spinner size="sm" />
                Calculando…
              </div>
            ) : simulation ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Valor de Face</span>
                  <span className="font-medium">{formatCurrency(simulation.faceValue, simulation.assetCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Taxa Base</span>
                  <span className="font-medium">{formatPercent(simulation.baseRate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spread</span>
                  <span className="font-medium">{formatPercent(simulation.spread)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Prazo</span>
                  <span className="font-medium">{simulation.termMonths} meses</span>
                </div>
                {simulation.exchangeRateUsed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Câmbio utilizado</span>
                    <span className="font-medium">{simulation.exchangeRateUsed.toFixed(4)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Valor Líquido</span>
                  <span className="text-lg font-bold text-brand-700">
                    {simulation.presentValueConverted
                      ? formatCurrency(simulation.presentValueConverted, simulation.paymentCurrency)
                      : formatCurrency(simulation.presentValue, simulation.assetCurrency)}
                  </span>
                </div>
              </>
            ) : null}
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
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <div>
          <p className="font-semibold text-gray-900">Liquidação realizada!</p>
          <p className="text-sm text-gray-500 mt-1">
            Valor líquido:{' '}
            <span className="font-medium text-gray-900">
              {settlement.presentValueConverted
                ? formatCurrency(settlement.presentValueConverted, settlement.paymentCurrency)
                : formatCurrency(settlement.presentValue, settlement.assetCurrency)}
            </span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleReset}>
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

      <Button type="submit" loading={creating} className="w-full mt-1">
        {creating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registrando…
          </>
        ) : (
          'Registrar Recebível'
        )}
      </Button>
    </form>
  );
}
