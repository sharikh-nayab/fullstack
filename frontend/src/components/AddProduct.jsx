import { useState } from 'react';
import { apiFetch } from '../utils/api';
import {
  Container,
  Form,
  Button,
  Card,
  Alert
} from 'react-bootstrap';

function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      price: parseFloat(price),
      description,
    };

    apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
    })
      .then((data) => {
        setMessage(data.message || 'Product added!');
        setName('');
        setPrice('');
        setDescription('');
      })
      .catch((err) => {
        console.error(err);
        setMessage('Error adding product');
      });
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Add New Product</h2>

        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Product name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control
              type="number"
              value={price}
              placeholder="Enter price"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              placeholder="Product description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Add Product
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AddProduct;
