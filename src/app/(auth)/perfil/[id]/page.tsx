'use client';

import React, { useEffect, useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Loader from '@/components/Loader';

import { getUser } from '@/services';
import { User } from '@/types/api';

const ProfilePage = () => {
  const [content, setContent] = useState<User | null>(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (typeof userId === 'string') {
      getUser(token, userId)
        .then((response) => setContent(response.user))
        .catch((error) => console.log(error));
    }
  }, [userId]);

  if (!content) {
    return <Loader />;
  }

  const handleEdit = () => {
    window.location.href = `/usuarios/editar/${userId}`;
  };

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.back}>
          <a
            className={S.link}
            onClick={() => window.history.back()}
            style={{ cursor: 'pointer' }}
          >
            &lt; Voltar
          </a>
        </div>
        <h1 className={S.title}>{content.name}</h1>
        <div className={S.content}>
          <h2> Dados do usuário</h2>
          <h3>Nome</h3>
          <p>{content.name}</p>
          <h3>E-mail</h3>
          <p>{content.email}</p>
          <h3>CPF</h3>
          <p>{content.cpf}</p>
          <div className={S.editButton}>
            <Button onClick={handleEdit} type="button" dataType="edit">
              {' '}
              Editar
              <BiSolidEditAlt />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
