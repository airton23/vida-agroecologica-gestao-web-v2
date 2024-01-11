import React from 'react';

import S from './styles.module.scss';

import { ResetPassword } from './components/ResetPassword';
export default function Home() {
  return (
    <main className={S.main}>
      <h1>Recuperar Senha</h1>
      <ResetPassword />
    </main>
  );
}
