import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import { motion } from "framer-motion";

export default function Home() {

  const [characters, setCharacters] = useState([]);
  const [genre, setGenre] = useState(null);
  const [charLimitError, setCharLimitError] = useState(false);
  const [noCharError, setNoCharError] = useState(false);
  const [noGenreError, setNoGenreError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState(null);

  const genres = [
    [{ emoji: "🧚", name: "Fantasy" }, { emoji: "🕵️‍♀️", name: "Mystery" }],
    [{ emoji: "🐉", name: "Folklore" }, { emoji: "⚗️", name: "Science Fiction" }],
    [{ emoji: "👻", name: "Horror" }, { emoji: "📜", name: "Historical Fiction" }],
    [{ emoji: "🐿️", name: "Fable" }, { emoji: "🪄", name: "Fairytale" }]
  ];

  const chars = [
    [{ emoji: "👸", name: "King & queen" }, { emoji: "️🕵️‍♀️", name: "Detective" }],
    [{ emoji: "🐉", name: "Dragon" }, { emoji: "🦄", name: "Unicorn" }],
    [{ emoji: "👩‍🔬", name: "Scientist" }, { emoji: "🐐", name: "Animal" }],
    [{ emoji: "🧙‍♂️️", name: "Wizard" }, { emoji: "🎃", name: "Ghost" }]
  ];

  function handleCheckbox(event) {

    if (!characters.length) {
      setCharacters((chars) => [...chars, event.target.name]);
      setCharLimitError(false);
    } else if (characters.length === 2 && event.target.checked) {
      setCharLimitError(true);
    } else if (characters.length === 1 && !characters.includes(event.target.name)) {
      setCharacters((chars) => [...chars, event.target.name]);
      setNoCharError(false);
      setCharLimitError(false);
    } else if (characters.length && characters.includes(event.target.name) && !event.target.checked) {
      setCharacters((chars) => [...chars.filter(char => char !== event.target.name)]);
      setCharLimitError(false);
    } else if (!event.target.checked) {
      setCharLimitError(false);
    }

  }

  function handleRadio(event) {
    setGenre(event.target.value);
    setNoGenreError(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (genre && characters.length === 2) {
      setNoCharError(false);
      setNoGenreError(false);
      setCharLimitError(false);
      setLoading(true);
      const data = {
        genre,
        characters
      };
      const JSONdata = JSON.stringify(data)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
      };
      const response = await fetch("/api/gpt3", options);
      const result = await response.json();
      setLoading(false);
      setStory(result.data);
    }

    if (!genre) {
      setNoGenreError(true);
    }

    if (characters.length < 2) {
      setNoCharError(true);
    }
  }

  function handleNewStory() {
    setStory(null);
  }

  //framer motion
  const parent = {
    hidden: {
      opacity: 1
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  }
  const children = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GPT3 Stories</title>
        <meta name="description" content="Generated micro-fiction stories for kids using GPT-3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Micro-fiction stories for kids using GPT-3.
        </motion.h1>
        <motion.div
          className={styles.steps}
          variants={parent}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={children} className={styles.step} >
            <span className={styles.bullet} >1</span>
            <span>Select a genre</span>
          </motion.div>
          <motion.div variants={children} className={styles.step} >
            <span className={styles.bullet} >2</span>
            <span>Select characters</span>
          </motion.div>
          <motion.div variants={children} className={styles.step} >
            <span className={styles.bullet} >3</span>
            <span>Click on Get a story</span>
          </motion.div>
        </motion.div>
        <form onSubmit={handleSubmit} className={styles.form} >
          <motion.div
            className={styles.genres}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            <div className={styles.genrestitle} >
              <p className={styles.cardtitle} >GENRES</p>
              {noGenreError && <p className={styles.error} >Please select a genre.</p>}
            </div>
            <div className={styles.genrescard} >
              {
                genres.map(item => {
                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "0.5rem" }} >
                        <label className={styles.radioinput} >
                          <input type="radio" onChange={handleRadio} name="genre" value={item[0].name} />
                          <div className={styles.radioinputlabel} >
                            <span className={styles.emoji} >{item[0].emoji}</span>
                            <span className={styles.radioinputtitle} >{item[0].name}</span>
                          </div>
                        </label>
                        <label className={styles.radioinput} >
                          <input type="radio" onChange={handleRadio} name="genre" value={item[1].name} />
                          <div className={styles.radioinputlabel} >
                            <span className={styles.emoji} >{item[1].emoji}</span>
                            <span className={styles.radioinputtitle} >{item[1].name}</span>
                          </div>
                        </label>
                      </div>
                    </>
                  )
                })
              }
            </div>
          </motion.div>
          <motion.div
            className={styles.genres}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            <div className={styles.genrestitle}>
              <p className={styles.cardtitle} >CHARACTERS(select 2 characters)</p>
              <div>
                {noCharError && <p className={styles.error} >Please select 2 characters.</p>}
                {charLimitError && <p className={styles.error} >Please select only 2 characters.</p>}
              </div>
            </div>
            <div className={styles.genrescard} >
              {
                chars.map(item => {
                  return (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: "0.5rem" }} >
                        <label className={styles.radioinput} >
                          <input type="checkbox" onChange={handleCheckbox} name={item[0].name} value={item[0].name} />
                          <div className={styles.radioinputlabel} >
                            <span className={styles.emoji} >{item[0].emoji}</span>
                            <span className={styles.radioinputtitle} >a {item[0].name}</span>
                          </div>
                        </label>
                        <label className={styles.radioinput} >
                          <input type="checkbox" onChange={handleCheckbox} name={item[1].name} value={item[0].name} />
                          <div className={styles.radioinputlabel} >
                            <span className={styles.emoji} >{item[1].emoji}</span>
                            <span className={styles.radioinputtitle} >a {item[1].name}</span>
                          </div>
                        </label>
                      </div>
                    </>
                  )
                })
              }
            </div>
          </motion.div>
          {
            !loading && !story
            &&
            <button type='submit' className={styles.submit} >
              Get a story
            </button>
          }
          {
            loading
            &&
            <motion.div
              className={styles.box}
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          }

        </form>
        <div style={{ width: "min(50rem, 90%)" }} >
          {
            story
            &&
            <div className={styles.genres} >
              {story}
            </div>
          }
        </div>
        {
            !loading && story
            &&
            <button className={styles.submit} onClick={handleNewStory} >
              Get a new one
            </button>
          }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/siddharth0x"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Siddharth
        </a>
      </footer>
    </div>
  )
}
