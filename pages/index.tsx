import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import GameGrid from '../components/GameGrid';

const Home: NextPage = () => {
  return (
    <Layout>
      <section className="two-column-view">
        <h3 className="section-title">Create a game</h3>
        <div>
          <GameGrid />
        </div>
      </section>
      <section className="two-column-view">
        <h3 className="section-title">Local games</h3>
        <div></div>
      </section>
    </Layout>
  );
};

export default Home;
