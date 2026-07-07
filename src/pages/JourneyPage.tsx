import { useEffect, useState } from "react";

import type { Journey } from "../Features/journey/types";
import type { Notebook, Page } from "../Features/notes/types";

import {
    loadJourneys,
    saveJourneys,
} from "../Features/journey/Storage/journeyStorage";

import {
    createJourney,
} from "../Features/journey/Utils/JourneyFactory";

import JourneyBrowser from "../Features/journey/Browser/JourneyBrowser";

import {
    loadNotebooks,
    saveNotebooks,
    loadPages,
} from "../Features/notes/storage/notebookStorage";
import { useNotesPageFunctions } from "../Features/notes/editor/NotesPageFunctions";
import BlockList from "../Features/notes/editor/BlockList";



export default function JourneyPage()
{

    // ======================================================
    // STATE
    // ======================================================

    const [journeys, setJourneys] =
        useState<Journey[]>([]);


    const [notebooks, setNotebooks] =
        useState<Notebook[]>([]);


    const [pages, setPages] =
        useState<Page[]>([]);


    const [selectedJourneyId, setSelectedJourneyId] =
        useState<string | null>(null);


    const [selectedPageId, setSelectedPageId] =
        useState<string | null>(null);

        const {
    blocks,
    tasks,
    focusedBlockId,

    handlePageTitleChange,
    handleUpdateBlock,
    handleConvertBlock,
    handleCreateBlockAfter,
    handleDeleteBlock,

    handleEditTask,
    handleDeleteTask,
    handleCanvasClick,

} = useNotesPageFunctions({
    selectedPageId,
});


    // ======================================================
    // LOAD DATA
    // ======================================================

    useEffect(() =>
    {
        setJourneys(
            loadJourneys()
        );


        setNotebooks(
            loadNotebooks()
        );


        setPages(
            loadPages()
        );

    }, []);




    // ======================================================
    // CREATE JOURNEY
    // ======================================================

    function handleCreateJourney()
    {
        const {
            journey,
            notebook,
        } =
            createJourney();



        const updatedJourneys =
        [
            ...journeys,
            journey,
        ];



        const updatedNotebooks =
        [
            ...notebooks,
            notebook,
        ];



        saveJourneys(
            updatedJourneys
        );


        saveNotebooks(
            updatedNotebooks
        );



        setJourneys(
            updatedJourneys
        );


        setNotebooks(
            updatedNotebooks
        );



        setSelectedJourneyId(
            journey.journeyId
        );
    }





    // ======================================================
    // SELECT JOURNEY
    // ======================================================

    function handleSelectJourney(
        journeyId:string
    )
    {
        setSelectedJourneyId(
            journeyId
        );


        setSelectedPageId(
            null
        );
    }





    // ======================================================
    // SELECT PAGE
    // ======================================================

    function handleSelectPage(
        pageId:string
    )
    {
        setSelectedPageId(
            pageId
        );
    }





    // ======================================================
    // DELETE NOTEBOOK
    // ======================================================

    function handleDeleteNotebook(
        notebookId:string
    )
    {

        const updatedNotebooks =
            notebooks.filter(
                (notebook)=>
                    notebook.id !== notebookId
            );


        const updatedJourneys =
            journeys.filter(
                (journey)=>
                    journey.notebookId !== notebookId
            );



        saveNotebooks(
            updatedNotebooks
        );


        saveJourneys(
            updatedJourneys
        );



        setNotebooks(
            updatedNotebooks
        );


        setJourneys(
            updatedJourneys
        );



        const deletedJourney =
            journeys.find(
                (journey)=>
                    journey.notebookId === notebookId
            );


        if(
            deletedJourney &&
            deletedJourney.journeyId === selectedJourneyId
        )
        {
            setSelectedJourneyId(null);

            setSelectedPageId(null);
        }

    }





    // ======================================================
    // RENAME NOTEBOOK
    // ======================================================

    function handleRenameNotebook(
        notebookId:string,
        title:string
    )
    {

        const updatedNotebooks =
            notebooks.map(
                (notebook)=>
                {

                    if(
                        notebook.id === notebookId
                    )
                    {
                        return {
                            ...notebook,
                            title,
                        };
                    }


                    return notebook;

                }
            );



        saveNotebooks(
            updatedNotebooks
        );


        setNotebooks(
            updatedNotebooks
        );

    }





    // ======================================================
    // SELECTED PAGE
    // ======================================================

    const selectedPage =
        pages.find(
            (page)=>
                page.id === selectedPageId
        );





    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            style={{
                display:"flex",
                height:"100vh",
                backgroundColor:
                    "rgba(20,12,55,0.38)",
            }}
        >


            <JourneyBrowser

                journeys={journeys}

                notebooks={notebooks}

                pages={pages}


                selectedJourneyId={
                    selectedJourneyId
                }


                selectedPageId={
                    selectedPageId
                }


                onCreateJourney={
                    handleCreateJourney
                }


                onSelectedJourney={
                    handleSelectJourney
                }


                onSelectedPage={
                    handleSelectPage
                }


                onDeleteNotebook={
                    handleDeleteNotebook
                }


                onRenameNotebook={
                    handleRenameNotebook
                }

            />




            <main
    style={{
        flex:1,
        display:"flex",
        justifyContent:"center",
        padding:"40px",
        overflowY:"auto",
    }}
>
{
    selectedPage
    ?

    (
        <div
            style={{
                width:"95%",
                backgroundColor:"rgba(20,12,55,0.38)",
                borderRadius:"10px",
                padding:"48px",
                minHeight:"900px",
            }}
        >

            <input
                value={selectedPage.title}
                onChange={(e)=>
                    handlePageTitleChange(
                        e.target.value
                    )
                }
                style={{
                    width:"100%",
                    fontSize:"2.5rem",
                    fontWeight:"bold",
                    background:"transparent",
                    border:"none",
                    outline:"none",
                }}
            />


            <hr
                style={{
                    margin:"40px 0"
                }}
            />

                {/* BLOCK EDITOR */}
            <div
                onClick={handleCanvasClick}
                style={{
                    flex: 1,
                    width: "100%",
                    minHeight: "600px",
                }}
            >
            <BlockList

                page={selectedPage}

                blocks={blocks}

                tasks={tasks}


                onUpdateBlock={
                    handleUpdateBlock
                }


                onConvertBlock={
                    handleConvertBlock
                }


                onCreateBlockAfter={
                    handleCreateBlockAfter
                }


                onDeleteBlock={
                    handleDeleteBlock
                }


                onEditTask={
                    handleEditTask
                }


                onDeleteTask={
                    handleDeleteTask
                }


                focusedBlockId={
                    focusedBlockId
                }

            />
            </div>


        </div>
    )

    :

    (
        <div>
            Select or create a journey.
        </div>
    )
}

</main>


        </div>

    );

}