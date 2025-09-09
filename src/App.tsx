import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import TeamDetailPage from '@/pages/TeamDetailPage'
import CreateTeamPage from '@/pages/CreateTeamPage'
import EditTeamPage from '@/pages/EditTeamPage'
import AddPlayerPage from '@/pages/AddPlayerPage'
import EditPlayerPage from '@/pages/EditPlayerPage'
import GenerateTeamsPage from '@/pages/GenerateTeamsPage'
import Layout from '@/components/Layout'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team/new" element={<CreateTeamPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/team/:id/edit" element={<EditTeamPage />} />
          <Route path="/team/:id/add-player" element={<AddPlayerPage />} />
          <Route path="/team/:teamId/player/:playerId/edit" element={<EditPlayerPage />} />
          <Route path="/team/:id/generate" element={<GenerateTeamsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
