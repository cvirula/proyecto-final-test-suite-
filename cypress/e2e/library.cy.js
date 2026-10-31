describe('flujo completo de la biblioteca', () => {
  beforeEach(() => {
    cy.request('POST', 'http://127.0.0.1:3100/api/test/reset');
    cy.visit('/');
  });

  it('registra, busca, presta y devuelve un libro', () => {
    cy.contains('Agregar libro').click();
    cy.get('input[name="title"]').type('Rayuela');
    cy.get('input[name="author"]').type('Julio Cortázar');
    cy.get('input[name="isbn"]').type('9788437604947');
    cy.get('input[name="year"]').clear().type('1963');
    cy.get('input[name="category"]').type('Novela');
    cy.contains('button', 'Guardar libro').click();
    cy.contains('Libro agregado a la colección.').should('be.visible');

    cy.get('[aria-label="Buscar libros"]').type('Rayuela');
    cy.get('[data-testid^="book-"]').should('have.length', 1).and('contain', 'Rayuela');
    cy.contains('button', 'Prestar').click();
    cy.get('[aria-label="Nombre del lector"]').type('Ana López');
    cy.contains('button', 'Confirmar préstamo').click();
    cy.contains('En manos de').should('be.visible');
    cy.contains('Ana López').should('be.visible');
    cy.contains('button', 'Devolver').click();
    cy.contains('Disponible').should('be.visible');
  });

  it('filtra los libros prestados', () => {
    cy.get('[data-testid="book-1"]').contains('Prestar').click();
    cy.get('[aria-label="Nombre del lector"]').type('Mario Gómez');
    cy.contains('button', 'Confirmar préstamo').click();
    cy.contains('button', 'Prestados').click();
    cy.get('[data-testid^="book-"]').should('have.length', 1).and('contain', 'Mario Gómez');
  });
});
