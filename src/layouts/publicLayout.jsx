import React, { useEffect, useState } from 'react'
import API from '../api'
import { useTranslation } from 'react-i18next'
import PublicSidebar from '../components/Pages/publicPage/publicSidebar'
import PublicPage from '../components/Pages/publicPage/publicPage'
import Layout from '../components/common/layout'
import sortArrayBy from '../utils/sortArrayBy'
import selectUsersFromNotes from '../utils/selectUsersFromNotes'

const PublicLayout = () => {
  const {t} = useTranslation()
  const [notes, setNotes] = useState([])
  const [users, setUsers] = useState()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('byDate')

  useEffect(() => {
    API.notes.fetchAllPublic().then((data) => {
      setNotes(sortArrayBy(sort, data))
      const users = selectUsersFromNotes(data)
      setUsers(users)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNotes(sortArrayBy(sort, notes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  const handleSearch = (value) => {
    setSearch(value)
  }

  const handleSort = (event) => {
    setSort(event.target.value)
  }

  const handleSelect = (localUsers) => {
    setUsers(localUsers)
  }

  const filterNotes = () => {
    let filtered = notes

    if (search) {
      filtered = filtered.filter(note => note.summary.toLowerCase().includes(search.toLowerCase()))
    }

    if (users) {
      const selectedUserList = users.filter(user => user.selected === true).map(user => user._id)
      filtered = filtered.filter(note => selectedUserList.includes(note.userId))
    }

    return filtered
  }

  const filteredNotes = filterNotes()

  return (
    <Layout title={notes ? t('PUBLIC_NOTES') : '...'}>
      <PublicSidebar search={search}
                     sort={sort}
                     users={users}
                     onSearch={handleSearch}
                     onSort={handleSort}
                     onSelect={handleSelect}/>
      <PublicPage notes={filteredNotes}/>
  </Layout>
  )
}

export default PublicLayout
