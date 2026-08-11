export interface Assignor {
  id: string;
  name: string;
  document: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignorPayload {
  name: string;
  document: string;
  email: string;
}

export interface UpdateAssignorPayload {
  name?: string;
  email?: string;
}
