document.addEventListener('DOMContentLoaded', function () {
    const SUPABASE_URL = 'https://uygvmxnptayikqxxklby.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5Z3ZteG5wdGF5aWtxeHhrbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5ODY4MjAsImV4cCI6MjAzNDU2MjgyMH0.gMQ2npomH3vRm16sSTHV_DfI-OlxSbGpMM8trYfvFcg';

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let currentForm = 'login';

    function toggleForm() {
        if (currentForm === 'login') {
            showCadastroForm();
        } else {
            showLoginForm();
        }
    }

    function showForm(title, fields, onSubmit, toggleText, toggleAction) {
        document.body.innerHTML = ''; 

        const container = document.createElement('div');
        container.style.width = '300px';
        container.style.margin = 'auto';
        container.style.padding = '20px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.marginTop = '30vh';
        container.style.overflow = 'hidden';

        const heading = document.createElement('h2');
        heading.textContent = title;
        heading.style.textAlign = 'center';

        const form = document.createElement('form');
        form.setAttribute('id', `${title.toLowerCase()}Form`);
        form.setAttribute('class', 'form');

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;
            label.style.display = 'block';
            label.style.marginBottom = '5px';

            const input = document.createElement('input');
            input.setAttribute('type', field.type);
            input.setAttribute('name', field.name);
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.marginBottom = '10px';

            if (field.min) {
                input.setAttribute('min', field.min);
            }

            if (field.max) {
                input.setAttribute('max', field.max);
            }

            form.appendChild(label);
            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = title;
        submitButton.style.width = '100%';
        submitButton.style.padding = '10px';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '3px';
        submitButton.style.cursor = 'pointer';
        form.appendChild(submitButton);

        const errorMessage = document.createElement('p');
        errorMessage.style.color = 'red';
        errorMessage.style.textAlign = 'center';
        container.appendChild(errorMessage);

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            onSubmit(formData, errorMessage);
        });

        container.appendChild(heading);
        container.appendChild(form);

        const toggleLink = document.createElement('a');
        toggleLink.textContent = toggleText;
        toggleLink.href = '#';
        toggleLink.className = 'toggle';
        toggleLink.style.display = 'block';
        toggleLink.style.marginTop = '10px';
        toggleLink.style.textAlign = 'center';

        toggleLink.addEventListener('click', function (event) {
            event.preventDefault();
            toggleAction();
        });

        container.appendChild(toggleLink);
        document.body.appendChild(container);
    }

    function showCadastroForm() {
        currentForm = 'cadastro';
        showForm(
            'Cadastro',
            [
                { label: 'Nome:', type: 'text', name: 'nome' },
                { label: 'Email:', type: 'email', name: 'email' },
                { label: 'Senha:', type: 'password', name: 'senha' }
            ],
            async (formData, errorMessage) => {
                const nome = formData.get('nome');
                const email = formData.get('email');
                const senha = formData.get('senha');

                const { data: existingUsers, error: checkError } = await _supabase
                    .from('cadastros')
                    .select('*')
                    .eq('email', email);

                if (checkError) {
                    errorMessage.textContent = 'Erro ao verificar o email.';
                    console.error('Erro ao verificar o email:', checkError.message);
                    return;
                }

                if (existingUsers.length > 0) {
                    errorMessage.textContent = 'Email já cadastrado.';
                    return;
                }

                const { data, error } = await _supabase
                    .from('cadastros')
                    .insert([{ nome, email, senha }]);

                if (error) {
                    errorMessage.textContent = 'Erro ao cadastrar.';
                    console.error('Erro ao cadastrar:', error.message);
                    return;
                }

                alert('Cadastro realizado com sucesso!');
                showLoginForm();
            },
            'Já possui uma conta? Login',
            showLoginForm
        );
    }

    function showLoginForm() {
        currentForm = 'login';
        showForm(
            'Login',
            [
                { label: 'Email:', type: 'email', name: 'email' },
                { label: 'Senha:', type: 'password', name: 'senha' }
            ],
            async (formData, errorMessage) => {
                const email = formData.get('email');
                const senha = formData.get('senha');

                const { data: users, error } = await _supabase
                    .from('cadastros')
                    .select('*')
                    .eq('email', email)
                    .eq('senha', senha);

                if (error) {
                    errorMessage.textContent = 'Erro ao fazer login.';
                    console.error('Erro ao fazer login:', error.message);
                    return;
                }

                if (users.length === 0) {
                    errorMessage.textContent = 'Email ou senha incorretos.';
                    return;
                }

                alert('Login realizado com sucesso!');
                showGradeCalculator();
            },
            'Ainda não tem uma conta? Cadastre-se',
            showCadastroForm
        );
    }

    function showGradeCalculator() {
        document.body.innerHTML = ''; 

        const container = document.createElement('div');
        container.style.width = '300px';
        container.style.margin = 'auto';
        container.style.padding = '20px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.marginTop = '30vh';
        container.style.overflow = 'hidden';

        const form = document.createElement('form');
        form.setAttribute('id', 'gradeForm');
        form.setAttribute('class', 'form');

        const fields = [
            { label: 'Nome do Aluno:', type: 'text', name: 'nome' },
            { label: 'Nota 1:', type: 'number', name: 'nota1', min: '0', max: '10' },
            { label: 'Nota 2:', type: 'number', name: 'nota2', min: '0', max: '10' },
            { label: 'Nota 3:', type: 'number', name: 'nota3', min: '0', max: '10' }
        ];

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;
            label.style.display = 'block';
            label.style.marginBottom = '5px';

            const input = document.createElement('input');
            input.setAttribute('type', field.type);
            input.setAttribute('name', field.name);
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.marginBottom = '10px';

            if (field.min) {
                input.setAttribute('min', field.min);
            }

            if (field.max) {
                input.setAttribute('max', field.max);
            }

            form.appendChild(label);
            form.appendChild(input);
        });

        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Calcular Média';
        submitButton.style.width = '100%';
        submitButton.style.padding = '10px';
        submitButton.style.backgroundColor = '#4CAF50';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '3px';
        submitButton.style.cursor = 'pointer';
        form.appendChild(submitButton);

        const resultMessage = document.createElement('p');
        resultMessage.style.textAlign = 'center';
        resultMessage.style.marginTop = '10px';
        container.appendChild(resultMessage);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const nome = formData.get('nome');
            const nota1 = parseFloat(formData.get('nota1'));
            const nota2 = parseFloat(formData.get('nota2'));
            const nota3 = parseFloat(formData.get('nota3'));

            if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
                resultMessage.textContent = 'Por favor, insira todas as notas.';
                resultMessage.style.color = 'red';
                return;
            }

            const media = (nota1 + nota2 + nota3) / 3;

            if (media >= 7) {
                resultMessage.textContent = `${nome} está Aprovado(a) com média ${media.toFixed(2)}.`;
                resultMessage.style.color = 'green';
            } else if (media >= 3) {
                resultMessage.textContent = `${nome} está na Recuperação com média ${media.toFixed(2)}.`;
                resultMessage.style.color = 'orange';
            } else {
                resultMessage.textContent = `${nome} está Reprovado(a) com média ${media.toFixed(2)}.`;
                resultMessage.style.color = 'red';
            }
        });

        container.appendChild(form);
        document.body.appendChild(container);
    }

    showLoginForm();
});
