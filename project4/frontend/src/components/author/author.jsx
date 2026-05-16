import { useState, useEffect } from "react";
import axios from 'axios';
import { Card, Table, Button, Modal, Form, ButtonGroup } from "react-bootstrap";

const baseURL = 'http://localhost:8080/author';
var add = '/add';
var get = '/get/';
var edit = '/update/';
var del = '/delete/';
var upload = '/upload/';
var download = '/download/';

const Author = () => {
    const [authors, setAuthors] = useState([]);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);

    const [modalDetails, setModalDetails] = useState(false);
    const [authorDetails, setAuthorDetails] = useState(null);
    const [authorCerts, setAuthorCerts] = useState([]);

    const [newAuthor, setNewAuthor] = useState({ name: '', address: '' });
    const [authorObj, setAuthorObj] = useState({ id: 0, name: '', address: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    // Her author için resim URL'ini tutan state
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => { getAllAuthors(); }, []);

    const getAllAuthors = async () => {
        try {
            const res = await axios.get(baseURL);
            setAuthors(res.data);
            // Resimleri yükle
            const urls = {};
            for (const a of res.data) {
                if (a.imagePath) {
                    urls[a.id] = baseURL + download + a.id + '?t=' + Date.now();
                }
            }
            setImageUrls(urls);
        } catch (err) { console.log(err); }
    };

    const generatePDF = async () => {
        try {
            const response = await axios.get(baseURL + "/pdf");
            alert("Success: " + response.data);
        } catch (err) {
            alert("PDF Error: Can not access the server!");
        }
    };

    const onAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(baseURL + add, newAuthor);
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                await axios.post(baseURL + upload + res.data.id, formData);
            }
            setNewAuthor({ name: '', address: '' });
            setSelectedFile(null);
            setModalAdd(false);
            getAllAuthors();
        } catch (err) { console.log(err); }
    };

    const onUpdate = async (id) => {
        try {
            const res = await axios.get(baseURL + get + id);
            setAuthorObj(res.data);
            setSelectedFile(null);
            setModalUpdate(true);
        } catch (err) { console.log(err); }
    };

    const onUpdateSet = async (e) => {
        e.preventDefault();
        try {
            await axios.put(baseURL + edit + authorObj.id, authorObj);
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                await axios.post(baseURL + upload + authorObj.id, formData);
                setSelectedFile(null);
            }
            setModalUpdate(false);
            getAllAuthors();
        } catch (err) { console.log(err); }
    };

    const onDelete = async (id) => {
        if (window.confirm('Author ' + id + ' will be deleted!')) {
            try {
                await axios.delete(baseURL + del + id);
                getAllAuthors();
            } catch (err) { console.log(err); }
        }
    };
    const onDetails = async (author) => {
        try {
            const res = await axios.get('http://localhost:8080/certification/author/' + author.id);
            setAuthorDetails(author);
            setAuthorCerts(res.data);
            setModalDetails(true);
        } catch (err) { console.log(err); }
    };

    const onDownload = async (id, name) => {
        try {
            const response = await axios.get(baseURL + download + id + '?t=' + Date.now(), {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_photo.jpg`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            alert(`File "${name}_photo.jpg" downloaded successfully.`);
        } catch (err) {
            alert("Download failed!");
        }
    };

    const onView = (id) => {
        window.open(baseURL + '/view/' + id + '?t=' + Date.now(), '_blank');
    };

    return (
        <div>
            {/* ADD AUTHOR MODAL */}
            <Modal show={modalAdd} onHide={() => { setModalAdd(false); setNewAuthor({ name: '', address: '' }); setSelectedFile(null); }}>
                <Modal.Header closeButton><Modal.Title>ADD AUTHOR</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onAdd}>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Name" required
                                value={newAuthor.name}
                                onChange={(e) => setNewAuthor({...newAuthor, name: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Address" required
                                value={newAuthor.address}
                                onChange={(e) => setNewAuthor({...newAuthor, address: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image (optional)</Form.Label>
                            <Form.Control type="file" accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files[0])} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-end">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* UPDATE AUTHOR MODAL */}
            <Modal show={modalUpdate} onHide={() => { setModalUpdate(false); setSelectedFile(null); }}>
                <Modal.Header closeButton><Modal.Title>UPDATE AUTHOR</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onUpdateSet}>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" value={authorObj.id} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" required value={authorObj.name}
                                onChange={(e) => setAuthorObj({ ...authorObj, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" required value={authorObj.address}
                                onChange={(e) => setAuthorObj({ ...authorObj, address: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image (optional)</Form.Label>
                            {authorObj.imagePath && (
                                    <Form.Check
                                        type="checkbox"
                                        label="Remove current photo"
                                        className="mb-2"
                                        onChange={async (e) => {
                                            if (e.target.checked) {
                                                await axios.delete(baseURL + '/image/' + authorObj.id);
                                                setAuthorObj({...authorObj, imagePath: null});
                                                setImageUrls(prev => { const u = {...prev}; delete u[authorObj.id]; return u; });
                                            }
                                        }}
                                    />
                                )}
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
                                <span style={{ color: '#999', fontSize: '13px' }}>
                                    {selectedFile ? selectedFile.name : (authorObj.imagePath ? '📷 Photo has already exist' : '📷 No Photo')}
                                </span>
                                <label style={{ margin: 0, cursor: 'pointer', background: '#0d6efd', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '13px' }}>
                                    Choose
                                    <input type="file" accept="image/*" hidden
                                        onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </label>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-end">Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={modalDetails} onHide={() => setModalDetails(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Author Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {authorDetails && (
                        <>
                            <div className="mb-3 p-3" style={{background:'#f8f9fa', borderRadius:'8px'}}>
                                <strong>ID:</strong> {authorDetails.id} &nbsp;|&nbsp;
                                <strong>Name:</strong> {authorDetails.name} &nbsp;|&nbsp;
                                <strong>Address:</strong> {authorDetails.address}
                            </div>
                            <h6>Certifications</h6>
                            {authorCerts.length === 0 ? (
                                <p className="text-muted">No certifications found.</p>
                            ) : (
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Patent Title</th>
                                            <th>Issue Date</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {authorCerts.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.id}</td>
                                                <td>{c.patent?.title}</td>
                                                <td>{c.issueDate}</td>
                                                <td>{c.durationInYear} Years</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>

            {/* AUTHORS TABLE */}
            <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Authors</span>
                    <ButtonGroup>
                        <Button variant="success" className="me-2" onClick={generatePDF}>Generate PDF</Button>
                        <Button variant="primary" onClick={() => setModalAdd(true)}>Add Author</Button>
                    </ButtonGroup>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>ADDRESS</th>
                                <th>IMAGE</th>
                                <th>OPERATIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authors.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td>{a.name}</td>
                                    <td>{a.address}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' , height: '60px'}}>
                                        {imageUrls[a.id] ? (
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                                                {/* Yuvarlak profil fotosu */}
                                                <img
                                                    src={imageUrls[a.id]}
                                                    alt={a.name}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '2px solid #dee2e6',
                                                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                                                    }}
                                                />
                                                {/* Görüntüle (göz ikonu) */}
                                                <button
                                                    onClick={() => onView(a.id)}
                                                    title="View"
                                                    style={{
                                                        background: 'none', border: '1px solid #0dcaf0',
                                                        borderRadius: '6px', padding: '5px 10px',
                                                        cursor: 'pointer', color: '#0dcaf0', fontSize: '16px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                    👁
                                                </button>
                                                {/* İndir butonu */}
                                                <button
                                                    onClick={() => onDownload(a.id, a.name)}
                                                    title="Download"
                                                    style={{
                                                        background: 'none', border: '1px solid #198754',
                                                        borderRadius: '6px', padding: '5px 10px',
                                                        cursor: 'pointer', color: '#198754', fontSize: '16px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                    ⬇
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 12px', borderRadius: '20px',
                                                background: '#f5f5f5', color: '#aaa', fontSize: '12px'
                                            }}>
                                                <span style={{ fontSize: '16px' }}>👤</span> No Photo
                                            </span>
                                        )}
                                    </td>
                                    <td >
                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => onUpdate(a.id)}>Update</Button>
                                        <Button variant="outline-danger" size="sm" className="me-2" onClick={() => onDelete(a.id)}>Delete</Button>
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => onDetails(a)}>Details</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Author;