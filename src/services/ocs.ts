import { api } from './api';

import { OCS, User } from '@/types/api';
import { AxiosError } from 'axios';

export async function getAllOCS(token: string): Promise<{ ocs: OCS[] }> {
  try {
    const response = await api.get('/api/ocs', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ocs: ', error);
    throw new Error('Failed to fetch ocs');
  }
}

export async function getOCS(token: string, id: string): Promise<{ ocs: OCS }> {
  try {
    const response = await api.get(`/api/ocs/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ocs: ', error);
    throw new Error('Failed to fetch ocs');
  }
}

export async function getUsersByOCS(
  token: string,
  id: string,
): Promise<{ users: User[] }> {
  try {
    const response = await api.get(`/api/ocs/participantes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users by ocs: ', error);
    throw new Error('Failed to fetch users by ocs');
  }
}

export async function vincularAgricultorOrganizacao(
  token: string,
  id: string,
  organizacaoId: string,
) {
  try {
    const response = await api.put(
      `api/agricultores/vincular/${id}`,
      {
        organizacao_id: organizacaoId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to link farmer to organization: ${response.statusText}`,
      );
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao vincular o agricultor à organização:', error);
    throw error;
  }
}

export async function desvincularAgricultor(token: string, id: string) {
  try {
    const response = await api.delete(`api/agricultores/desvincular/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao desvincular o agricultor:', error);
    throw error;
  }
}

export async function createOCS(
  {
    nome,
    cnpj,
    email,
    telefone,
    rua,
    numero,
    cep,
    bairro_id,
    associacao_id,
    agricultores_id,
  }: OCS,
  token: string,
) {
  try {
    const response = await api.post(
      '/api/ocs',
      {
        nome,
        cnpj,
        email,
        telefone,
        rua,
        numero,
        cep,
        bairro_id,
        associacao_id,
        agricultores_id,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response) {
        console.error(
          `[createOCS] Erro retornado pela API: ${error?.response?.data}`,
        );
        throw error;
      } else if (error?.request) {
        console.error(`[createOCS] Erro na requisição: ${error?.request}`);
        throw new Error('Erro na requisição.');
      } else {
        console.error(
          `[createOCS] Ocorreu um erro desconhecido na requisição: ${
            (error as Error).message
          }`,
        );
        throw new Error('Ocorreu um erro desconhecido na requisição.');
      }
    } else if (error instanceof Error) {
      console.error(
        `[createOCS] Ocorreu um erro genérico: ${JSON.stringify(
          error?.message,
        )}`,
      );
      throw new Error('Ocorreu um erro genérico.');
    } else {
      console.error(
        `[createOCS] Ocorreu um erro desconhecido: ${(error as Error).message}`,
      );
      throw new Error('Ocorreu um erro desconhecido.');
    }
  }
}

export async function editOCS(
  {
    nome,
    cnpj,
    email,
    telefone,
    rua,
    numero,
    cep,
    bairro_id,
    associacao_id,
    agricultores_id,
  }: OCS,
  token: string,
  id: string,
) {
  try {
    const response = await api.patch(
      `/api/ocs/${id}`,
      {
        nome,
        cnpj,
        email,
        telefone,
        rua,
        numero,
        cep,
        bairro_id,
        associacao_id,
        agricultores_id,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error?.response) {
        console.error(
          `[editOCS] Erro retornado pela API: ${error?.response?.data}`,
        );
        throw error;
      } else if (error?.request) {
        console.error(`[editOCS] Erro na requisição: ${error?.request}`);
        throw new Error('Erro na requisição.');
      } else {
        console.error(
          `[editOCS] Ocorreu um erro desconhecido na requisição: ${error?.message}`,
        );
        throw new Error('Ocorreu um erro desconhecido na requisição.');
      }
    } else if (error instanceof Error) {
      console.error(
        `[editOCS] Ocorreu um erro genérico: ${JSON.stringify(error?.message)}`,
      );
      throw new Error('Ocorreu um erro genérico.');
    } else {
      console.error(
        '[editOCS] Ocorreu um erro desconhecido:',
        (error as Error)?.message,
      );
      throw new Error('Ocorreu um erro desconhecido.');
    }
  }
}

export async function removeOCS(token: string, id: number) {
  try {
    const response = await api.delete(`/api/ocs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to remove ocs:', error);
    throw new Error('Failed to remove ocs');
  }
}
