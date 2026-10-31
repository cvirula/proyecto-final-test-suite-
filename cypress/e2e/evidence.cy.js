describe('evidencias del proyecto Lumen', () => {
  before(() => {
    cy.request('POST', 'http://127.0.0.1:3100/api/test/reset');
  });

  it('captura el flujo de registro y préstamo', () => {
    cy.viewport(1440, 960);
    cy.visit('/');
    cy.contains('Historias disponibles.').should('be.visible');
    cy.screenshot('01-pantalla-principal', { capture: 'viewport' });

    cy.contains('button', 'Agregar libro').click();
    cy.get('input[name="title"]').type('Rayuela');
    cy.get('input[name="author"]').type('Julio Cortázar');
    cy.get('input[name="isbn"]').type('9788437604947');
    cy.get('input[name="year"]').clear().type('1963');
    cy.get('input[name="category"]').type('Novela');
    cy.screenshot('02-formulario-libro', { capture: 'viewport' });

    cy.contains('button', 'Guardar libro').click();
    cy.contains('Libro agregado a la colección.').should('be.visible');
    cy.get('[aria-label="Buscar libros"]').type('Rayuela');
    cy.get('[data-testid^="book-"]').should('have.length', 1);
    cy.screenshot('03-catalogo-libro-creado', { capture: 'viewport' });

    cy.contains('button', 'Prestar').click();
    cy.get('[aria-label="Nombre del lector"]').type('Ana López');
    cy.contains('button', 'Confirmar préstamo').click();
    cy.contains('Ana López').should('be.visible');
    cy.screenshot('04-libro-prestado', { capture: 'viewport' });
  });
});
