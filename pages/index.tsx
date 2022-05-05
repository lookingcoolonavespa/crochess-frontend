import { useState } from 'react';
import { UserContext } from '../utils/contexts/UserContext';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/Layout';
import GameGrid from '../components/CreateGame/GameGrid';
import ListOfGames from '../components/LocalGames/ListOfGames';

import styles from '../styles/Home.module.scss';
import Popup from '../components/Popup';
import useInputValues from '../utils/hooks/useInputValues';
import { createGame } from '../utils/game';
import { GameType } from '../types/types';

const Home: NextPage = () => {
  const [user, setUser] = useState('');
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState('');
  const { inputValues: popupInputValues, handleChange: handleChange } =
    useInputValues();
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
              <GameGrid
                active={activeTab === 'Create a game'}
                createCustomGame={() => setPopup(true)}
              />
              <ListOfGames active={activeTab === 'Game list'} />
            </div>
          </div>
          {popup && (
            <Popup
              title="Create a game"
              fields={[
                { label: 'Time', name: 'time', type: 'number' },
                { label: 'Increment', name: 'increment', type: 'number' },
                { label: 'Choose your color', name: 'color', type: 'text' },
              ]}
              close={() => setPopup(false)}
              inputValues={popupInputValues}
              handleChange={handleChange}
              isMobile={false}
              actionBtnText="Create game"
              noCancelBtn={false}
              submitAction={() =>
                createGame(
                  popupInputValues.time as number,
                  popupInputValues.increment as number,
                  popupInputValues.color as 'black' | 'white',
                  user,
                  popupInputValues.gameType as GameType
                )
              }
              setError={setError}
            />
          )}
        </UserContext.Provider>
      </Layout>
    </>
  );
};

export default Home;
