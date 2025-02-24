'use client';

import S from './components/styles.module.scss';

import RegisterForm from './components/registerForm';

export default function Home() {
  return (
    <main className={S.mainForm}>
      <div className={S.container}>
        <RegisterForm />
      </div>
    </main>
  );
}
