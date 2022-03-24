import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import LocalGames from '../components/LocalGames/LocalGames';
import CreateGame from '../components/CreateGame/CreateGame';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <html color-mode="light" />
      </Head>
      <Layout>
        <CreateGame />
        <LocalGames />
      </Layout>
    </>
  );
};

export default Home;
