if (typeof window !== "undefined" && typeof document !== "undefined") {

    document.addEventListener('DOMContentLoaded', function() {

        // Inicializar dropdowns del navbar
        var dropdowns = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdowns, {
            hover: false,
            coverTrigger: false,
            constrainWidth: false
        });

        // Inicializar sidenav para móvil
        var sidenav = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sidenav, {        
            closeOnClick: false
        });

        // Inicializar selects del formulario
        var selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
    });

}

    
    
    



