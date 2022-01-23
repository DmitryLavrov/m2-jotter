import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Layout from './common/layout'
import Note from '../pages/main/common/note'
import JotterNotesSidebar from '../pages/sidebar/jotterNotesSidebar/jotterNotesSidebar'
import useNotes from '../../hooks/useNotes'
import sortArrayBy from '../../utils/sortArrayBy'
import useNoteControlDropdown from '../../hooks/useNoteControlDropdown'

const JotterNotesLayout = () => {
  const {t} = useTranslation()
  const [selectedNote, setSelectedNote] = useState()
  const [notes, setNotes] = useState()
  const [jotter, setJotter] = useState()
  const {
    getJotter, fetchNotes, getNote, updateNote, addNewNote, deleteNote
  } = useNotes(notes, setNotes, setSelectedNote)
  const {
    paramsDropdownBtn, hideDeleteConfirm, renderControlDropdown
  } = useNoteControlDropdown(handleDeleteNote, handleUpdateNote, selectedNote)

  const {jotterId, noteId} = useParams()
  const history = useHistory()

  useEffect(() => {
    getJotter(jotterId).then((data) => {
      setJotter(data)
      fetchNotes(jotterId).then(data => {
        setNotes(sortArrayBy('byDate', data))
      })
    })
  }, [jotterId])

  useEffect(() => {
    // =========================
    console.log('notes:', notes)
    console.log('noteId:', noteId)
    // =========================
    if (notes && noteId) {
      getNote(noteId).then(data => setSelectedNote(data))
    }
  }, [notes, noteId])

  useEffect(() => {
    if (!noteId && notes && (notes.length > 0)) {
      history.push(`/jotters/${jotterId}/${notes[0]._id}`)
    }
  }, [notes])

  async function handleUpdateNote(note) {
    await updateNote(note)
  }

  const handleCreateNewNote = async () => {
    const newNote = await addNewNote({jotterId, title: t('MY_NEW_NOTE')})
    history.push(`/jotters/${jotterId}/${newNote._id}`)
  }

  async function handleDeleteNote(note) {
    await deleteNote(note)
    const newNotes = sortArrayBy('byDate', notes.filter(n => (n._id !== note._id)))
    setNotes(newNotes)
    if (newNotes.length > 0) {
      history.push(`/jotters/${jotterId}/${newNotes[0]._id}`)
    } else {
      history.push(`/jotters/${jotterId}`)
    }
    hideDeleteConfirm()
  }

  return (<>
    <Layout title={jotter ? jotter.title : '...'}>
      <JotterNotesSidebar notes={notes}
                          onCreateNewNote={handleCreateNewNote}/>

      {(notes && notes.length === 0)
        ?
        <p className="no-card">
          {t('CREATE_NEW_NOTE')}
        </p>

        :
        <Note note={selectedNote}
              type="PRIVATE"
              onUpdate={handleUpdateNote}
              paramsDropdownBtn={paramsDropdownBtn}/>
      }
    </Layout>

    {renderControlDropdown}
  </>)
}

export default JotterNotesLayout