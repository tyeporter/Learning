import * as React from 'react';
import PropTypes from 'prop-types'
import Table from './Table';
import { fetchPopularRepos } from '../utils/api';

function Languages({
    selected,
    onUpdateLanguage
}) {
    const languages = [
        'All',
        'JavaScript',
        'Ruby',
        'Java',
        'CSS',
        'TypeScript',
        'Go',
        'Python'
    ];

    return (
        <select
            onChange={(e) => onUpdateLanguage(e.target.value)}
            value={selected}>
            {languages.map((lang, index) => (
                <option
                    key={index}
                    value={lang}>
                    {lang}
                </option>
            ))}
        </select>
    );
}

Languages.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
};

export default class Popular extends React.Component {
    state = {
        selectedLanguage: 'JavaScript',
        repos: null,
        error: null
    };

    updateLanguage = (selectedLanguage) => {
        this.setState({
            selectedLanguage,
            error: null
        });

        fetchPopularRepos(selectedLanguage)
            .then(repos => this.setState({ repos }))
            .catch(error => {
                console.warn('Error fetching repos: ', error);
                this.setState({ error: 'There was an error fetching repositories' })
            });
    };

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage);
    }

    render() {
        const { selectedLanguage, repos, error } = this.state;
        return (
            <main className='stack main-stack animate-in'>
                <div className='split'>
                    <h1>Popular</h1>
                    <Languages
                        selected={this.state.selectedLanguage}
                        onUpdateLanguage={this.updateLanguage}
                    />
                </div>
                {error && <p className='text-center error'>{error}</p>}
                {repos && <Table repos={repos} />}
            </main>
        );
    }
}
