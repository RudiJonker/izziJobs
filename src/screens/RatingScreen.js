const submitRating = async (jobSeekerId, rating) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Please log in to rate.");
    return;
  }
  try {
    const { error } = await supabase
      .from('ratings')
      .insert({ employer_id: user.id, job_seeker_id, rating });
    if (error) {
      alert(`Rating error: ${error.message}`);
    } else {
      alert("Rating submitted successfully!");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};