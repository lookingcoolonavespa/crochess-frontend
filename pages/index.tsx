import { useState } from 'react';
import { UserContext } from '../utils/contexts/UserContext';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import LocalGames from '../components/LocalGames/LocalGames';
import CreateGame from '../components/CreateGame/CreateGame';

const Home: NextPage = () => {
  const [user, setUser] = useState(null);
  return (
    <>
      <Layout>
        <UserContext.Provider value={{ user, setUser }}>
          <CreateGame />
          <LocalGames />
        </UserContext.Provider>
      </Layout>
      <footer></footer>
    </>
  );
};

export default Home;
