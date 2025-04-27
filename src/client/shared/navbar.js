

function buildNavBar(currentPage){
    const nav = document.createElement('nav');
    nav.className='navbar overlay content';

    const ul = document.createElement('ul');

    const pages = [ {name: 'Home', href:'index.html'},
                    {name:'Flashcards', href:'flashcardPage.html'},
                    {name:'Quiz', href:'quiz.html'},
                    {name:'About Us',href:'index.html'} // currently, about page is not made so index.html is referenced
                ];
    pages.forEach( page => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = page.href;
        a.textContent = page.name; 

        if (page.name === currentPage){
            li.classList.add('current-page');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
}