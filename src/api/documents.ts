import { apiFetch } from './http';

export interface DocumentDTO {
  id?: string;
  type: string;
  title: string;
  meta?: string;
}

export async function listDocuments(limit = 50, offset = 0) {
  return apiFetch<DocumentDTO[]>(`/documents?limit=${limit}&offset=${offset}`);
}

export async function createDocument(doc: DocumentDTO) {
  return apiFetch<DocumentDTO>(`/documents`, {
    method: 'POST',
    body: JSON.stringify(doc),
  });
}

export async function getDocument(id: string) {
  return apiFetch<DocumentDTO>(`/documents/${id}`);
}

export async function updateDocument(id: string, doc: Partial<DocumentDTO>) {
  return apiFetch<DocumentDTO>(`/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doc),
  });
}

export async function deleteDocument(id: string) {
  return apiFetch<void>(`/documents/${id}`, { method: 'DELETE' });
}
