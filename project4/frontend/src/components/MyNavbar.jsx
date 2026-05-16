import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Dropdown} from "react-bootstrap";

const MyNavbar = (args) => {

    return (
        <>
            <Navbar bg="primary" expand="md" data-bs-theme="dark" className="justify-content-center navbar-top" fixed="top">
                <Container>
                    <Navbar.Brand href="/" onClick={() => args.onHandle('home')}>PMS</Navbar.Brand>
                    <Nav className="me-auto">
                        {/* Authors Menüsü */}
                        <Nav.Link className="me-3" onClick={() => args.onHandle('authors')}
                            style={{color: 'rgba(255,255,255,0.85)', fontWeight: 500}}>
                            Authors
                        </Nav.Link>

                        {/* Patents Menüsü */}
                        <Nav.Link className="me-3" onClick={() => args.onHandle('patents')}
                            style={{color: 'rgba(255,255,255,0.85)', fontWeight: 500}}>
                            Patents
                        </Nav.Link>

                        {/* Certifications Menüsü */}
                        <Nav.Link className="me-3" onClick={() => args.onHandle('certifications')}
                            style={{color: 'rgba(255,255,255,0.85)', fontWeight: 500}}>
                            Certifications
                        </Nav.Link>

                        {/* About */}
                        <Nav.Link onClick={() => args.onHandle('about')}
                            style={{color: 'rgba(255,255,255,0.85)', fontWeight: 500}}>
                            About
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            {/* Navbar fixed="top" olduğu için içeriğin Navbar'ın altında kalmaması için boşluk bırakıyoruz */}
            <div style={{ marginTop: '80px' }}></div>
        </>
    );
};
export default MyNavbar;