import { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

const baseURL = 'http://localhost:8080/certification';

const Certification = () => {
    const [certifications, setCertifications] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [patents, setPatents] = useState([]);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);

    // Ekleme ve Güncelleme için state'ler
    const [newCert, setNewCert] = useState({ issueDate: '', durationInYear: '', authorId: '', patentId: '' });
    const [certObj, setCertObj] = useState({ id: 0, issueDate: '', durationInYear: '', authorId: '', patentId: '' });

    useEffect(() => {
        fetchData();
        axios.get("http://localhost:8080/author").then(res => setAuthors(res.data));
        axios.get("http://localhost:8080/patent").then(res => setPatents(res.data));
    }, []);

    const fetchData = () => {
        axios.get(`${baseURL}/join`).then((res) => setCertifications(res.data));
    };

    // --- PDF OLUŞTURMA ---
    const generatePDF = async () => {
        try {
            const response = await axios.get(`${baseURL}/pdf`);
            alert("Success: " + response.data);
        } catch (err) {
            alert("PDF Error: Can not access the server!");
        }
    };

   const handleAdd = async (e) => {
           e.preventDefault();
           try {
               // Spring Boot'un beklediği Entity formatına dönüştürüyoruz
               const payload = {
                   issueDate: newCert.issueDate,
                   durationInYear: Number(newCert.durationInYear), // String'i sayıya çevirdik
                   author: { id: Number(newCert.authorId) },       // authorId yerine author objesi
                   patent: { id: Number(newCert.patentId) }        // patentId yerine patent objesi
               };

               await axios.post(`${baseURL}/add`, payload);
               setModalAdd(false);
               setNewCert({ issueDate: '', durationInYear: '', authorId: '', patentId: '' });
               fetchData();
           } catch (err) {
              const message = err.response?.data?.message || err.response?.data || "Add operation failed!";
                      alert(message);
                  }
              };

    // --- SİLME (DELETE) ---
    const handleDelete = async (id) => {
        if (window.confirm('Certification ' + id + ' will be deleted!')) {
            try {
                await axios.delete(`${baseURL}/delete/${id}`);
                fetchData();
            } catch (err) {
                console.log(err);
            }
        }
    };

    // --- GÜNCELLEME MODALINI AÇMA (GET BY ID) ---
       const onUpdate = async (id) => {
           try {
               const res = await axios.get(`${baseURL}/get/${id}`);
               setCertObj({
                   ...res.data,
                   authorId: String(res.data.author?.id || ''),
                   patentId: String(res.data.patent?.id || '')
               });
               setModalUpdate(true);
           } catch (err) { console.log(err); }
       };

    // --- GÜNCELLENMİŞ GÜNCELLEMEYİ KAYDETME (PUT) ---
        const handleUpdateSet = async (e) => {
            e.preventDefault();
            try {
                // Aynı formatı güncelleme için de uyguluyoruz
                const payload = {
                    id: certObj.id,
                    issueDate: certObj.issueDate,
                    durationInYear: Number(certObj.durationInYear),
                    author: { id: Number(certObj.authorId) },
                    patent: { id: Number(certObj.patentId) }
                };

                await axios.put(`${baseURL}/update/${certObj.id}`, payload);
                setModalUpdate(false);
                fetchData();
            } catch (err) {
                 const message = err.response?.data?.message || err.response?.data || "Update operation failed!";
                        alert(message);
                }
        };

    return (
        <Card className="mt-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Certifications (Join Table)</span>
                <ButtonGroup>
                    <Button variant="success" className="me-2" onClick={generatePDF}>Generate PDF</Button>
                    <Button variant="primary" onClick={() => setModalAdd(true)}>Add Certification</Button>
                </ButtonGroup>
            </Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>AUTHOR</th>
                            <th>PATENT TITLE</th>
                            <th>DATE</th>
                            <th>DURATION</th>
                            <th>OPERATIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certifications.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.author?.name}</td>
                                <td>{c.patent?.title}</td>
                                <td>{c.issueDate}</td>
                                <td>{c.durationInYear} Years</td>
                                <td>
                                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => onUpdate(c.id)}>Update</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>

            {/* --- EKLEME MODALI --- */}
            <Modal show={modalAdd} onHide={() =>{setModalAdd(false);
                setNewCert({ issueDate: '', durationInYear: '', authorId: '', patentId: '' }); }}>
                <Modal.Header closeButton><Modal.Title>ADD CERTIFICATION</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAdd}>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Select required value={newCert.authorId} onChange={(e) => setNewCert({...newCert, authorId: e.target.value})}>
                                <option value="">Select Author</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Patent</Form.Label>
                            <Form.Select required value={newCert.patentId} onChange={(e) => setNewCert({...newCert, patentId: e.target.value})}>
                                <option value="">Select Patent</option>
                                {patents.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Issue Date</Form.Label>
                            <Form.Control type="date" required value={newCert.issueDate} onChange={(e) => setNewCert({...newCert, issueDate: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration (Years)</Form.Label>
                            <Form.Control type="number" required value={newCert.durationInYear} onChange={(e) => setNewCert({...newCert, durationInYear: e.target.value})} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-end">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- GÜNCELLEME MODALI --- */}
            <Modal show={modalUpdate} onHide={() => {setModalUpdate(false);
                setNewCert({ issueDate: '', durationInYear: '', authorId: '', patentId: '' });}}>
                <Modal.Header closeButton><Modal.Title>UPDATE CERTIFICATION</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSet}>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" value={certObj.id} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Select required value={certObj.authorId} onChange={(e) => setCertObj({...certObj, authorId: e.target.value})}>
                                <option value="">Select Author</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Patent</Form.Label>
                            <Form.Select required value={certObj.patentId} onChange={(e) => setCertObj({...certObj, patentId: e.target.value})}>
                                <option value="">Select Patent</option>
                                {patents.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Issue Date</Form.Label>
                            <Form.Control type="date" required value={certObj.issueDate} onChange={(e) => setCertObj({...certObj, issueDate: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration (Years)</Form.Label>
                            <Form.Control type="number" required value={certObj.durationInYear} onChange={(e) => setCertObj({...certObj, durationInYear: e.target.value})} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="float-end">Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Card>
    );
};

export default Certification;