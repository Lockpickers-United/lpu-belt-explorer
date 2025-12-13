import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import ProjectsPage from './ProjectsPage'
import Tracker from '../app/Tracker.jsx'
import {dialFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function ProjectsRoute() {

    usePageTitle("Master's Projects")

    return (
        <FilterProvider filterFields={dialFilterFields}>
            <Nav title="Master's Projects"/>

            <ProjectsPage/>

            <Footer/>

            <Tracker feature='projects'/>

        </FilterProvider>
    )
}