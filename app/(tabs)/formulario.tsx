import { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function BasicExample() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nota, setNota] = useState('');
  const MAX_LENGTH = 200;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  

  return (
    <div style={styles.scrollWrapper}>
      <div style={styles.formWrapper}>
        <Form style={styles.form}>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formNombreProducto">
            <Form.Label style={styles.titleText}>Nombre Producto</Form.Label>
            <Form.Control
              type="nombre"
              placeholder="Ingrese nombre del producto"
              style={styles.input}
            />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formFechaCompra">
            <Form.Label style={styles.titleText}>Fecha de compra</Form.Label>
            <Form.Control
              type="date"
              placeholder="DD/MM/AAAA"
              style={styles.input}
            />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formGarantia">
            <Form.Label style={styles.titleText}>Duración Garantía</Form.Label>
            <Form.Control
              type="garantia"
              placeholder="Meses de garantía"
              style={styles.input}
            />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formMarca">
            <Form.Label style={styles.titleText}>Marca</Form.Label>
            <Form.Control type="marca" style={styles.input} />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formModelo">
            <Form.Label style={styles.titleText}>Modelo</Form.Label>
            <Form.Control type="modelo" style={styles.input} />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formTienda">
            <Form.Label style={styles.titleText}>Tienda</Form.Label>
            <Form.Control type="tienda" style={styles.input} />
          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formNotas">
            <Form.Label style={styles.titleText}>Notas</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Observaciones del producto"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={MAX_LENGTH}
              style={styles.input}
              />
              <Form.Text muted>
                {nota.length}/{MAX_LENGTH} caracteres usados <br />
                Te quedan <strong>{MAX_LENGTH - nota.length} </strong>caracteres
              </Form.Text>

          </Form.Group>
          <Form.Group style={styles.stepContainer} className="mb-3" controlId="formArchivo">
            <Form.Label style={styles.titleText}>Archivo</Form.Label>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              id="input-archivo"
            />
            <Button
              variant="secondary"
              onClick={handleFileClick}
              id="btn-subir-archivo"
              style={styles.button}
            >
              Subir archivo
            </Button>
          </Form.Group>
          <div style={styles.buttonRow}>
            <Button
              variant="primary"
              type="submit"
              id="btn-cancelar"
              style={styles.button}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              id="btn-guardar"
              style={styles.button}
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  scrollWrapper: {
    minHeight: '100vh',
    width: '100vw',
    overflowY: 'auto',
    background: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  formWrapper: {
    margin: '32px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  form: {
    background: '#fff',
    padding: 32,
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    minWidth: 320,
    maxWidth: 400,
    width: '100%',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 4,
    color: '#222',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    fontSize: 16,
    fontWeight: 400,
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginTop: 4,
    marginBottom: 4,
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  button: {
    marginRight: 8,
    marginTop: 8,
    minWidth: 110,
    fontWeight: 600,
    fontSize: 16,
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
  },
};

export default BasicExample;