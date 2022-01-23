import React, { useEffect, useState } from 'react'

import sortArrayBy from '../../utils/sortArrayBy'
import JottersSidebar from '../pages/sidebar/jottersSidebar'
import Jotters from '../pages/main/jotters/jotters'
import Layout from './common/layout'
import { useTranslation } from 'react-i18next'
import useJotters from '../../hooks/useJotters'
import useJotterControlDropdown from '../../hooks/useJotterControlDropdown'

const JottersLayout = () => {
  const {t} = useTranslation()
  const [jotters, setJotters] = useState()
  const [sort, setSort] = useState('byDate')
  const [filter, setFilter] = useState('all')
  const {fetchJotters, updateJotter, addNewJotter, deleteJotter, getJotter} = useJotters(jotters, setJotters)
  const {
    paramsDropdownBtn, showSettingsCard, hideDeleteConfirm, renderControlDropdown
  } = useJotterControlDropdown(getJotter, handleUpdateJotter, handleDeleteJotter)

  useEffect(() => {
    fetchJotters().then(data => {
      setJotters(data)
    })
  }, [])

  useEffect(() => {
    setJotters(jotters)
  }, [sort])

  const handleSort = ({value}) => {
    setSort(value)
  }

  const handleFilter = ({value}) => {
    setFilter(value)
  }

  const onAddNewJotter = () => {
    showSettingsCard()
  }

  async function handleDeleteJotter(id) {
    await deleteJotter(id)
    hideDeleteConfirm()
  }

  async function handleUpdateJotter(jotter) {
    if (jotter._id) {
      await updateJotter(jotter)
    } else {
      await addNewJotter(jotter, '619032cad8df581c4881d9a2')
    }
  }

  const filteredAndSortedJotters = () => {
    const sortedJotters = sortArrayBy(sort, jotters)
    if (sortedJotters && (filter === 'withPublicNotes')) {
      return sortedJotters.filter(j => j.hasPublicNote === true)
    }
    return sortedJotters
  }

  return (<>
    <Layout title={jotters ? t('PRIVATE_JOTTERS') : '...'}>
      <JottersSidebar sort={sort}
                      filter={filter}
                      onSort={handleSort}
                      onFilter={handleFilter}
                      onAddNewJotter={onAddNewJotter}/>
      <Jotters jotters={filteredAndSortedJotters()}
               paramsDropdownBtn={paramsDropdownBtn}
               onAddNewJotter={onAddNewJotter}/>
    </Layout>

    {renderControlDropdown}
  </>)
}

export default JottersLayout
