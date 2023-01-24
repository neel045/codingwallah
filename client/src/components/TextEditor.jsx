import { useState } from "react"
import ReactMde from "react-mde"
import Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css"

const TextEditor = ({ content, changeContent }) => {
    const [selectedTab, setSelectedTab] = useState("write")

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })

    return (
        <ReactMde
            value={content}
            onChange={changeContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
        />
    )
}

export default TextEditor
