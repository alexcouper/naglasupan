17/12/2025

Things are *almost* working, and yet also quite far.


Web UI:
 - It's running here:http://sideprojectprodaa67l9qf-frontend.functions.fnc.fr-par.scw.cloud/login
 - I've changed to do the export method but I'm now not sure that's wise. Instead we could make all the pages not have "use client", and then I think we can just talk to web-backend internally in the backend, and prevent the /admin page from being publically available. This should also prevent CORS pain

DNS
 - Haven't got a domain yet or linked that