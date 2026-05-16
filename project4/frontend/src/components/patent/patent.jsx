import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import { ButtonGroup, Modal, Card, Form } from "react-bootstrap";

const baseURL = 'http://localhost:8080/patent';

const Patent = () => {
    const [patents, setPatents] = useState([]);

    // Saf React için form state'leri
    const [newPatent, setNewPatent] = useState({ title: '', description: '' }); // Ekleme için
    const [patentObj, setPatentObj] = useState({ id: 0, title: '', description: '' }); // Güncelleme için

    const [modalAdd, setModalAdd] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);

    useEffect(() => {
        getAllPatents();
    }, []);

    // Tüm verileri çek
    const getAllPatents = async () => {
        try {
            const res = await axios.get(baseURL);
            setPatents(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // PDF Oluşturma
    const generatePDF = async () => {
        try {
            const response = await axios.get(baseURL + "/pdf");
            alert("Success: " + response.data);
        } catch (err) {
            alert("PDF Error: Can not access the server!");
        }
    };

    // Yeni Patent Ekleme (e.preventDefault() eklendi)
    const onAdd = async (e) => {
        e.preventDefault(); // Formun sayfayı yenilemesini engeller
        try {
            await axios.post(baseURL + "/add", newPatent);
            setNewPatent({ title: '', description: '' }); // Form inputlarını temizle
            setModalAdd(false); // Modalı kapat
            getAllPatents(); // Tabloyu güncelle
        } catch (err) {
            console.log(err);
        }
    };

    // Güncelleme Modalını Açma ve Veriyi Doldurma
    const onUpdate = async (id) => {
        try {
            const res = await axios.get(baseURL + "/get/" + id);
            setPatentObj(res.data);
            setModalUpdate(true);
        } catch (err) {
            console.log(err);
        }
    };

    // Güncellenmiş Veriyi Gönderme
    const onUpdateSet = async (e) => {
        e.preventDefault();
        try {
            await axios.put(baseURL + "/update/" + patentObj.id, patentObj);
            setModalUpdate(false);
            getAllPatents();
        } catch (err) {
            console.log(err);
        }
    };

    // Patent Silme
    const onDelete = async (id) => {
        if (window.confirm('Patent ' + id + ' will be deleted!')) {
            try {
                await axios.delete(baseURL + "/delete/" + id);
                getAllPatents();
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div>
            {/* ADD PATENT MODAL */}
            <Modal show={modalAdd} onHide={() => setModalAdd(false)}>
                <Modal.Header closeButton><Modal.Title>ADD PATENT</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Card><Card.Body>
                        <Form onSubmit={onAdd}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Title"
                                    required
                                    value={newPatent.title}
                                    onChange={(e) => setNewPatent({ ...newPatent, title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description"
                                    required
                                    value={newPatent.description}
                                    onChange={(e) => setNewPatent({ ...newPatent, description: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="float-end">Add</Button>
                        </Form>
                    </Card.Body></Card>
                </Modal.Body>
            </Modal>

            {/* UPDATE PATENT MODAL */}
            <Modal show={modalUpdate} onHide={() => setModalUpdate(false)}>
                <Modal.Header closeButton><Modal.Title>UPDATE PATENT</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Card><Card.Body>
                        <Form onSubmit={onUpdateSet}>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" value={patentObj.id} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    required
                                    value={patentObj.title}
                                    onChange={(e) => setPatentObj({ ...patentObj, title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    required
                                    value={patentObj.description}
                                    onChange={(e) => setPatentObj({ ...patentObj, description: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="float-end">Update</Button>
                        </Form>
                    </Card.Body></Card>
                </Modal.Body>
            </Modal>

            {/* PATENTS TABLE */}
            <Card className="mt-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>Patents</span>
                    <ButtonGroup>
                        <Button variant="success" className="me-2" onClick={generatePDF}>Generate PDF</Button>
                        <Button variant="primary" onClick={() => setModalAdd(true)}>Add Patent</Button>
                    </ButtonGroup>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>TITLE</th>
                                <th>DESCRIPTION</th>
                                <th>OPERATIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patents.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>
                                    <td>{p.description}</td>
                                    <td>
                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => onUpdate(p.id)}>Update</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => onDelete(p.id)}>Delete</Button>
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

export default Patent;