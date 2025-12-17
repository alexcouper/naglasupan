17/12/2025

Things are *almost* working, and yet also quite far.

Database:
 - I can connect to the sql db from my machine, and I've created superuser and run migrate

Web backend:
 - Logging in gives me a 500 (https://sideprojectprodaa67l9qf-backend.functions.fnc.fr-par.scw.cloud/admin/login/?next=/admin/login)
 - Can't see any logs in scaleway
 - I assume it's db related (even a failed login cred has the same result)

Web UI:
 - It's running here:http://sideprojectprodaa67l9qf-frontend.functions.fnc.fr-par.scw.cloud/login
 - I've changed to do the export method but I'm now not sure that's wise. Instead we could make all the pages not have "use client", and then I think we can just talk to web-backend internally in the backend, and prevent the /admin page from being publically available. This should also prevent CORS pain

DNS
 - Haven't got a domain yet or linked that