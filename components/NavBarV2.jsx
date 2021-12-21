import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import React, {useEffect, useState} from 'react';

const NavBarV2 = (props) => {
  const [active, setActive] = useState('');

  useEffect(() => {
    // hacky
    const pageName = window.location.pathname.substring(1);
    setActive(pageName);
  }, [])
  
  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <Container>
      <Navbar.Brand href="/">ACM-W OSU</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)} className="me-auto">
          <Nav.Link eventKey="attendance" href="/attendance">Attendance</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link target="_blank" href="https://github.com/jgeorge37/acmwosu-db">View on GitHub &#8599;</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBarV2;
