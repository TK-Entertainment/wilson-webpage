import { Nav } from 'next-docs-ui/nav'
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons"

const links = [
    {
        label: "Instagram",
        icon: <FontAwesomeIcon icon={faInstagram} />,
        href: "https://instagram.com/wilson_note",
        external: true
    },
    {
        label: "GitHub",
        icon: <FontAwesomeIcon icon={faGithub} />,
        href: "https://github.com/TK-Entertainment/wilson-webpage",
        external: true
    }
]

export default function Navbar() {
    return (
        <Nav
            transparent={true}
            links={links}
            collapsibleSidebar={false}
            enableSidebar={false}
        >
            <Link href="/" className="text-2xl font-bold">威爾森的科普天地</Link>
        </Nav>
    )
}