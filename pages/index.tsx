import { useState } from 'react';
import { SeekerContext } from '../utils/contexts/seekerContext';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import LocalGames from '../components/LocalGames/LocalGames';
import CreateGame from '../components/CreateGame/CreateGame';

const Home: NextPage = () => {
  const [seeker, setSeeker] = useState(null);
  return (
    <>
      <Head>
        <html color-mode="light" />
      </Head>
      <Layout>
        <SeekerContext.Provider value={{ seeker, setSeeker }}>
          <CreateGame />
          <LocalGames />
        </SeekerContext.Provider>
      </Layout>
      <footer></footer>
    </>
  );
};

export default Home;
