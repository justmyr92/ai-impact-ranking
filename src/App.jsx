import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/(csd)/DashboardPage";
import SDOfficePage from "./pages/(csd)/SDOfficePage";
import InstrumentsPage from "./pages/(csd)/InstrumentPage";
import AddInstrumentPage from "./pages/(csd)/AddInstrumentPage";
import ViewInstrumentPage from "./pages/(csd)/ViewInstrumentPage";
import SDDashboardPage from "./pages/(sd)/SDDashboardPage";
import SDRecordPage from "./pages/(sd)/SDRecordPage";
import CSDRecordPage from "./pages/(csd)/CSDRecordPage";
import FIleRanking from "./pages/(csd)/FIleRanking";
import EditInstrument from "./pages/(csd)/EditInstrument";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/csd/impact-ranking" element={<DashboardPage />} />
                <Route path="/csd/sd-office" element={<SDOfficePage />} />

                <Route path="/csd/instruments" element={<InstrumentsPage />} />
                <Route path="/sd/instruments" element={<InstrumentsPage />} />

                <Route
                    path="/csd/view-instrument/:instrument_id"
                    element={<ViewInstrumentPage />}
                />
                <Route
                    path="/csd/add-instrument/"
                    element={<AddInstrumentPage />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                    path="/sd/impact-ranking"
                    element={<SDDashboardPage />}
                />
                <Route path="/sd/record-tracks" element={<FIleRanking />} />
                <Route path="/csd/record-tracks" element={<FIleRanking />} />

                <Route path="/sd/records" element={<SDRecordPage />} />
                <Route path="/csd/records" element={<CSDRecordPage />} />
                <Route
                    path="/csd/edit-instrument/:instrument_id"
                    element={<EditInstrument />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
