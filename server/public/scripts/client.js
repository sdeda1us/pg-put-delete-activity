$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookList').on('click', '.btn-delete', deleteBook);
  $('#bookList').on('click', '.btn-read', changeStatus);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class='btn-read'>Mark as Read</button>`);
    $tr.append(`<td><button class='btn-delete'>Delete</button></td>`);
    $('#bookShelf').append($tr);
  }
}

//identifies which unique id to delete from the database
function deleteBook() {
  console.log('in deleteBook');
  let bookId = ($(this).closest('tr').data('book').id);
  $.ajax({
    method: 'DELETE',
    url: `books/${bookId}`
  })
  .then(function(response) {
    refreshBooks();
  })
  .catch(function(error){
    console.log('error in GET', error);
  });
}

//identify the unique id of the row to modify in the database
function changeStatus(){
  console.log('in cahngeStatus');
  let bookId = ($(this).closest('tr').data('book').id);
  let book = ($(this).closest('tr').data('book'));
  $.ajax({
    method: 'PUT',
    url: `books/${bookId}`,
    data: {book: book}
  })
  .then(function(response) {
    refreshBooks();
  })
  .catch(function(error){
    console.log('error in GET', error);
  });
}