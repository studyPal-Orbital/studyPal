import React, { useEffect } from 'react'
import { useState } from 'react'
import {db} from "../../firebase.js"
import { UserAuth } from '../../context/AuthContext'
import {
    collection,
    query,
    onSnapshot
} from "firebase/firestore"
import lowfi from "../gif/lowfi.gif";
import night from "../gif/night.gif";
import sunset from "../gif/sunset.gif";
import train from "../gif/train.gif";
import cat from "../gif/cat.gif";
import { faL } from '@fortawesome/free-solid-svg-icons'

const songTitles = ['Celtic Battle', 
                    'Rain lo-fi', 
                    'Audiomachine ', 
                    'Movie soundtracks', 
                    'Jazz-hop lo-fi', 
                    'Indie games lo-fi', 
                    'Anime piano covers', 
                    'Beach', 
                    'Studio Ghibli piano covers',
                    'Classic lo-fi ', 
                    'Workout EDM', 
                    'Odesza',
                    'Forest', 
                    'Gaming EDM', 
                    'Rain', 
                    'English pop songs piano cover', 
                    'Fire ', 
                    'Happy tropical EDM', 
                    'Kpop songs piano cover', 
                    'Hans Zimmer soundtrack']
                
const gif = [lowfi, night, sunset, train, cat]

const Music = () => {

    const {user}  = UserAuth()

    const [songs, setSongs] = useState([])
    const [genreCategorySongs, setGenreCategorySongs] = useState([])
    const [genreCategorySongTitles, setGenreCategorySongTitles] = useState(songTitles)

    const [ genre, setSelectedGenre ] = useState("All")
    const [ gifState, setGifState ] = useState(0)
    const [ userSongSearchInput, setUserSongSearchInput ] = useState("")
    const [ userSelectedSongTitle, setUserSelectedSongTitle ] = useState("")
    const [ userSelectedSongTrack, setUserSelectedSongTrack ] = useState(songs[0])
    const [ collapseSearchBar, setCollapseSearchBar ] = useState(true)

    /* Retrieve all songs */
    useEffect((e) => {
        let active = true
        if (active == true && user.uid != null) {
            const q = query(collection(db, "songs"))
            console.log("Retrieving songs")
            const getAllSongs = onSnapshot(q, (querySnapshot) => {
                let allSongs = []
                querySnapshot.forEach((doc) => {
                    allSongs.push({...doc.data()})
                })
                setSongs(() => allSongs)
                console.log(allSongs)
            })}
    }, [user.uid])

    /* Toggle to next gif */
    let showNextGif = () => {
        if (gifState < gif.length-1) {
            setGifState(() => gifState + 1)
        } else {
            setGifState(() => 0)
        }
    }

    /* Record user selected music genre */
    let updateSongGenre = (e) => {
        setSelectedGenre(() => e.target.value)
        let filteredSongs = songs.filter((song) => e.target.value != "All" ? song['genre'] == e.target.value : songs)
        let filteredSongsTitle = filteredSongs.map((song) => song['title'])
        setGenreCategorySongs(() => filteredSongs)
        setGenreCategorySongTitles(() => filteredSongsTitle)
    }

    /* Record user typed music search */
    const recordUserSongSearchInput = (e) => {
        setCollapseSearchBar(() => false)
        setUserSongSearchInput(() => e.target.value)
    }

    /* Record user selected song */
    const recordUserSelectedSong = (e) => {
        let songSelected = songs.filter((song) => song['title'] == e.target.value)[0]['link']
        console.log(songSelected)
        setUserSelectedSongTrack(() => songSelected)
        setUserSelectedSongTitle(() => e.target.value)
        setUserSongSearchInput(() => e.target.value)
        setCollapseSearchBar(() => true)
    }

    return (
        <div>
            <div id="music-button-container">
                <select id="music-genre-select" onChange={updateSongGenre} data-cy="genre-select">
                    <option value={"All"}>All</option>
                    <option value={"lo-fi"}>Lo-fi</option>
                    <option value={"piano"}>Piano</option>
                    <option value={"epic cinematic"}>Epic cinematic</option>
                    <option value={"EDM"}>EDM</option>
                    <option value={"Sounds of nature"}>Sounds of nature</option>
                </select>
                <input
                    id={"music-search-bar"}
                    placeholder={"Search for songs"}
                    value={userSongSearchInput}
                    onChange={recordUserSongSearchInput}
                    data-cy="search-music"
                    onClick={() => setCollapseSearchBar(!collapseSearchBar)}
                />
                <button id="next-button" onClick={showNextGif}>
                        Next Gif
                </button>
                </div>
                <div id="music-search-options-container" data-cy="search-bar">
                    {collapseSearchBar == false && userSongSearchInput != "" && genreCategorySongTitles.map((song) => {
                        if (song.toLocaleLowerCase().match(userSongSearchInput.toLocaleLowerCase())) {
                            return (
                                <button 
                                    value={song} 
                                    onClick={recordUserSelectedSong}
                                    id={"music-search-option"}
                                    data-cy="option"
                                >
                                    {song}
                                </button>
                    )}})}
                    {collapseSearchBar == false && userSongSearchInput == "" && genreCategorySongTitles.map((song) => {
                        return (
                            <button 
                                value={song} 
                                onClick={recordUserSelectedSong}
                                id={"music-search-option"}
                                data-cy="option"
                            >
                                {song}
                            </button>
                    )})}
                </div>
            <img
                id="music-bg"
                src={gif[gifState]}
                onClick={() => setCollapseSearchBar(true)}
            />
            {userSelectedSongTitle != "" && <audio controls 
                id="audio-bar"
                frameBorder="0" scrolling="no"
                autoPlay="true"
                src={userSelectedSongTrack}
                data-cy="audio"
            />}
       </div>
    )
}

export default Music 