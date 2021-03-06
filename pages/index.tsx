import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { UserContext } from '../utils/contexts/UserContext';
import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../components/Layout';
import GameGrid from '../components/CreateGame/GameGrid';
import ListOfGames from '../components/LocalGames/ListOfGames';

import styles from '../styles/Home.module.scss';

import Popup from '../components/Popup';
import useInputValues from '../utils/hooks/useInputValues';
import { createGameSeek } from '../utils/game';
import Modal from '../components/Modal';
import { toMilliseconds } from '../utils/timerStuff';
import { getGameType, getOppColor } from '../utils/misc';

const Home: NextPage = () => {
  const [user, setUser] = useState('');
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState('');
  const {
    inputValues: popupInputValues,
    handleInputChange,
    handleSelectChange,
    resetInputValues,
  } = useInputValues({
    increment: 0,
    time_unit: 'minutes',
    color: 'random',
  });
  const [activeTab, setActiveTab] = useState('Create a game');

  const socketRef = useRef<Socket | null>(null);

  useEffect(function connectToSocket() {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_URL_BACKEND}/games`);

    const socket = socketRef.current;
    socketRef.current.on('connect', () => {
      console.log(socket.id);
      setUser(socket.id);
    });
  }, []);

  function moveToTab(e: React.MouseEvent<HTMLElement>) {
    if (!e.currentTarget.dataset.tab) return;
    setActiveTab(e.currentTarget.dataset.tab);
  }
  return (
    <>
      <Head>
        <title>croChess</title>
      </Head>
      <Layout className={styles.main}>
        <UserContext.Provider
          value={{ user, setUser, socket: socketRef.current }}
        >
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
            <Modal
              close={() => {
                resetInputValues();
                setPopup(false);
              }}
            >
              <Popup
                title="Create a game"
                fields={[
                  {
                    label: 'Time',
                    name: 'time',
                    type: 'number',
                    unitsDisplay: {
                      label: '',
                      name: 'time_unit',
                      type: 'dropdown',
                      options: [
                        { value: 'seconds', display: 'seconds' },
                        {
                          value: 'minutes',
                          display: 'minutes',
                        },
                        { value: 'hours', display: 'hours' },
                      ],
                    },
                  },
                  {
                    label: 'Increment',
                    name: 'increment',
                    type: 'number',
                    unitsDisplay: { label: 'seconds' },
                  },
                  {
                    label: 'Choose your color',
                    name: 'color',
                    type: 'radioList',
                    options: [
                      { value: 'black' },
                      { value: 'random' },
                      { value: 'white' },
                    ],
                  },
                ]}
                close={() => {
                  resetInputValues();
                  setPopup(false);
                }}
                inputValues={popupInputValues}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                isMobile={false}
                actionBtnText="Create game"
                noCancelBtn={false}
                submitAction={() => {
                  const gameTime = toMilliseconds({
                    [popupInputValues.time_unit]:
                      popupInputValues.time as number,
                  });
                  createGameSeek(
                    gameTime,
                    popupInputValues.increment as number,
                    getOppColor(popupInputValues.color as 'black' | 'white'),
                    user,
                    getGameType(gameTime)
                  );
                }}
                setError={setError}
              />
            </Modal>
          )}
        </UserContext.Provider>
      </Layout>
    </>
  );
};

export default Home;
