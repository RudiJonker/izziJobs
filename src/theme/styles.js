import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    // Removed justifyContent: 'center' from here
  },
  scrollContent: { paddingBottom: 40, flexGrow: 1 }, // Keep as is
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  profilePicContainer: { alignItems: 'center', marginBottom: 16 },
  profilePic: { width: 100, height: 100, borderRadius: 50 },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  errorText: { color: 'red', marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, borderRadius: 5, padding: 10, backgroundColor: '#fff' },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerText: { fontSize: 16, color: '#000' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '100%', borderRadius: 5, padding: 10, backgroundColor: '#fff' },
  modalScroll: { maxHeight: '90%' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  modalItemText: { fontSize: 16, color: '#000', textAlign: 'left' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  skillCard: { padding: 8, borderRadius: 5, margin: 5, backgroundColor: '#48d22b' },
  skillText: { color: '#fff', fontSize: 14 },
  doneButton: { marginTop: 10 },
  saveButton: { marginTop: 16, backgroundColor: '#48d22b' },
  logoutButton: { marginTop: 10, borderColor: '#48d22b', color: '#48d22b' },
});