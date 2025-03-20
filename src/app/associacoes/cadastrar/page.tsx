'use client';

import { redirect, useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import { getAllBairros } from '@/services';
import { createAssociacao } from '@/services/associations';
import { getPresidents } from '@/services/user';
import { Bairro, Presidente } from '@/types/api';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { AxiosError } from 'axios';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [telefone, setTelefone] = useState('');
  const [street, setStreet] = useState('');
  const [cep, setCEP] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  const [bairro, setBairro] = useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = useState(1);

  const [presidents, setPresidents] = useState<Presidente[]>([]);
  const [selectedPresidents, setSelectedPresidents] = useState(2);

  const secretarioId = [3];
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }

    getPresidents(token)
      .then((response) => setPresidents(response))
      .catch((error) => console.log(error));
    getAllBairros(token)
      .then((response) => setBairro(response))
      .catch((error) => console.log(error));
  }, []);

  const fetchAddress = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setComplement(data.complemento || '');
      } else {
        setErrorMessage('CEP não encontrado.');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Erro ao buscar o CEP.');
    }
  };

  const handleCEPChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    let cepValue = target.value.replace(/\D/g, '');

    if (cepValue.length > 5) {
      cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8);
    }

    setCEP(cepValue);
    if (cepValue.replace('-', '').length === 8) {
      fetchAddress(cepValue.replace('-', ''));
    }
  };

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      if (name.length < 10) {
        setErrorMessage('Nome da associação deve ter no mínimo 10 caracteres.');
        return;
      }
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }
      await createAssociacao(
        {
          nome: name,
          email: email,
          telefone: telefone,
          data_fundacao: date,
          rua: street,
          cep: cep,
          numero: number,
          bairro_id: selectedBairro,
          secretarios_id: secretarioId,
          presidentes_id: [selectedPresidents],
        },
        token,
      );
      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(`[createAssociacao] AxiosError: ${JSON.stringify(error)}`);
        if (error?.response?.status === 500) {
          setTimeout(() => {}, 4000);
        } else {
          setErrorMessage(
            'Erro ao cadastrar associação. Por favor, verifique os dados e tente novamente.',
          );
        }
      } else if (error instanceof Error) {
        console.log(
          `[createAssociacao] Erro genérico: ${JSON.stringify(error)}`,
        );
        setErrorMessage(
          `Erro genérico ao cadastrar associação. ${JSON.stringify(error?.message)}`,
        );
      } else {
        console.log(
          `[createAssociacao] Erro desconhecido: ${JSON.stringify(error)}`,
        );
        setErrorMessage(
          `Erro desconhecido ao cadastrar associação. ${JSON.stringify(error)}`,
        );
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Cadastrar</h1>
        <p>
          <strong>Associação</strong>
        </p>
        <form className={S.form} onSubmit={handleRegister}>
          <h3>Dados</h3>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone</label>
              <Input
                name="telefone"
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                mask="phone"
              />
            </div>
            <div>
              <label htmlFor="date">
                Data de Fundação<span>*</span>
              </label>
              <Input
                name="date"
                type="date"
                placeholder="DD-MM-AAAA"
                value={date}
                mask="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <MuiSelect
              label="Presidentes"
              selectedNames={selectedPresidents}
              setSelectedNames={setSelectedPresidents}
            >
              {presidents?.map((item) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.name}
                </StyledSelect>
              ))}
            </MuiSelect>
          </section>
          <h3>Endereço</h3>
          <section>
            <div>
              <label htmlFor="cep">
                Cep<span>*</span>
              </label>
              <Input
                name="cep"
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={handleCEPChange}
                mask="zipCode"
              />
            </div>
            <div>
              <label htmlFor="street">
                Rua<span>*</span>
              </label>
              <Input
                name="street"
                type="text"
                placeholder="Rua"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <MuiSelect
              label="Bairro"
              selectedNames={selectedBairro}
              setSelectedNames={setSelectedBairro}
            >
              {bairro?.map((item: { id: number; nome: string }) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <div>
              <label htmlFor="number">
                Número<span>*</span>
              </label>
              <Input
                name="number"
                type="number"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complement">Complemento</label>
              <Input
                name="complement"
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>
          </section>
          <div className={S.wrapperButtons}>
            <Button
              onClick={() => router.back()}
              type="button"
              dataType="transparent"
            >
              Voltar
            </Button>{' '}
            <Button dataType="filled" type="submit">
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        open={errorMessage.length > 0}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
