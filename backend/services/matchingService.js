const calculateMatchPercentage = (user1, user2) => {
  let totalPoints = 0;
  let matchedPoints = 0;

  // Political Beliefs (20 points)
  totalPoints += 20;
  const user1Political = Array.isArray(user1.politicalBeliefs)
    ? user1.politicalBeliefs
    : [user1.politicalBeliefs];
  const user2Political = Array.isArray(user2.politicalBeliefs)
    ? user2.politicalBeliefs
    : [user2.politicalBeliefs];

  const politicalMatch = user1Political.some((belief) =>
    user2Political.includes(belief),
  );
  if (politicalMatch) matchedPoints += 20;

  // Religion (20 points)
  totalPoints += 20;
  if (user1.religion === user2.religion) {
    matchedPoints += 20;
  }

  // Life Stage (30 points) - MOST IMPORTANT
  totalPoints += 30;
  const user1LifeStage = Array.isArray(user1.lifeStage)
    ? user1.lifeStage
    : [user1.lifeStage];
  const user2LifeStage = Array.isArray(user2.lifeStage)
    ? user2.lifeStage
    : [user2.lifeStage];

  const lifeStageMatches = user1LifeStage.filter((stage) =>
    user2LifeStage.includes(stage),
  ).length;

  if (lifeStageMatches > 0) {
    matchedPoints += Math.min(30, lifeStageMatches * 10);
  }

  // Causes (20 points)
  totalPoints += 20;
  const causesMatches = (user1.causes || []).filter((cause) =>
    (user2.causes || []).includes(cause),
  ).length;

  if (causesMatches > 0) {
    matchedPoints += Math.min(20, causesMatches * 4);
  }

  // Looking For (10 points)
  totalPoints += 10;
  const user1LookingFor = Array.isArray(user1.lookingFor)
    ? user1.lookingFor
    : [user1.lookingFor];
  const user2LookingFor = Array.isArray(user2.lookingFor)
    ? user2.lookingFor
    : [user2.lookingFor];

  const lookingForMatch = user1LookingFor.some((goal) =>
    user2LookingFor.includes(goal),
  );
  if (lookingForMatch) matchedPoints += 10;

  // Calculate percentage
  const percentage = Math.round((matchedPoints / totalPoints) * 100);

  return percentage;
};

module.exports = {
  calculateMatchPercentage,
};
