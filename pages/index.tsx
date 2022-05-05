import { useState } from 'react';
import { UserContext } from '../utils/contexts/UserContext';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import GameGrid from '../components/CreateGame/GameGrid';
import ListOfGames from '../components/LocalGames/ListOfGames';

import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Create a game');

  function moveToTab(e: React.MouseEvent<HTMLElement>) {
    if (!e.currentTarget.dataset.tab) return;
    setActiveTab(e.currentTarget.dataset.tab);
  }

  return (
    <>
      <Layout className={styles.main}>
        <UserContext.Provider value={{ user, setUser }}>
          <div className={styles['tabbed-content']}>
            <nav className={styles.tabs}>
              <ul>
                <li
                  className={
                    activeTab !== 'Create a game' ? styles.inactive : ''
                  }
                  onClick={moveToTab}
                  data-tab="Create a game"
                >
                  <span>Create a game</span>
                </li>
                <li
                  className={activeTab !== 'Game list' ? styles.inactive : ''}
                  onClick={moveToTab}
                  data-tab="Game list"
                >
                  <span>Game list</span>
                </li>
              </ul>
            </nav>
            <div className={styles.content}>
              <GameGrid active={activeTab === 'Create a game'} />
              <ListOfGames active={activeTab === 'Game list'} />
            </div>
          </div>
        </UserContext.Provider>
      </Layout>
      <footer></footer>
    </>
  );
};

export default Home;
