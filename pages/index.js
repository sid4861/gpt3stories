import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';

export default function Home() {

  const [characters, setCharacters] = useState([]);
  const [genre, setGenre] = useState(null);
  const [charLimitError, setCharLimitError] = useState(false);
  const [noCharError, setNoCharError] = useState(false);
  const [noGenreError, setNoGenreError] = useState(false);

  const genres = [
    [{ emoji: "🧚", name: "Fantasy" }, { emoji: "🕵️‍♀️", name: "Mystery" }],
    [{ emoji: "🐉", name: "Folklore" }, { emoji: "⚗️", name: "Science Fiction" }],
    [{ emoji: "👻", name: "Horror" }, { emoji: "📜", name: "Historical Fiction" }],
    [{ emoji: "🐿️", name: "Fable" }, { emoji: "🪄", name: "Fairytale" }]
  ];

  const chars = [
    [{ emoji: "👸", name: "Kings & queens" }, { emoji: "️🕵️‍♀️", name: "Detectives" }],
    [{ emoji: "🐉", name: "Dragons" }, { emoji: "🦄", name: "Unicorns" }],
    [{ emoji: "👩‍🔬", name: "Scientists" }, { emoji: "🐐", name: "Animals" }],
    [{ emoji: "🧙‍♂️️", name: "Wizards" }, { emoji: "🎃", name: "Ghosts" }]
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
      console.log(result.data);
    }

    if (!genre) {
      setNoGenreError(true);
    }

    if (characters.length < 2) {
      setNoCharError(true);
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
        <h1 className={styles.title}>
          Micro-fiction stories for kids using GPT-3.
        </h1>
        <div className={styles.steps}>
          <div className={styles.step} >
            <span className={styles.bullet} >1</span>
            <span>Select a genre</span>
          </div>
          <div className={styles.step} >
            <span className={styles.bullet} >2</span>
            <span>Select characters</span>
          </div>
          <div className={styles.step} >
            <span className={styles.bullet} >3</span>
            <span>Click on Get a story</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form} >
          <div className={styles.genres} >
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
          </div>
          <div className={styles.genres} >
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
                            <span className={styles.radioinputtitle} >{item[0].name}</span>
                          </div>
                        </label>
                        <label className={styles.radioinput} >
                          <input type="checkbox" onChange={handleCheckbox} name={item[1].name} value={item[0].name} />
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
          </div>
          <button type='submit' className={styles.submit} >
            Get a story
          </button>
        </form>
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
