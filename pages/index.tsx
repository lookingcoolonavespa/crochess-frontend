import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import GameGrid from '../components/GameGrid';
import TwoColumnView from '../components/TwoColumnView';
import ListOfGames from '../components/ListOfGames';

const Home: NextPage = () => {
  return (
    <Layout>
      <TwoColumnView title="Create a game">
        <GameGrid />
      </TwoColumnView>
      <TwoColumnView title="Local games">
        <ListOfGames />
      </TwoColumnView>
    </Layout>
  );
};

export default Home;
