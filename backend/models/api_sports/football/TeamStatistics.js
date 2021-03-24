const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	form: {
		type: String,
		required: true
	},
	fixtures: {
		played: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
			total: {
				type: Number,
				default: null
			}
		},
		wins: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
			total: {
				type: Number,
				default: null
			}
		},
		draws: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
			total: {
				type: Number,
				default: null
			}
		},
		loses: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
			total: {
				type: Number,
				default: null
			}
		}
	},
	goals: {
		for: {
			total: {
				home: {
					type: Number,
					default: null
				},
				away: {
					type: Number,
					default: null
				},
				total: {
					type: Number,
					default: null
				}
			},
			avarage: {
				home: {
					type: String,
					default: null
				},
				away: {
					type: String,
					default: null
				},
				total: {
					type: String,
					default: null
				}
			}
		},
		against: {
			total: {
				home: {
					type: Number,
					default: null
				},
				away: {
					type: Number,
					default: null
				},
				total: {
					type: Number,
					default: null
				}
			},
			avarage: {
				home: {
					type: String,
					default: null
				},
				away: {
					type: String,
					default: null
				},
				total: {
					type: String,
					default: null
				}
			}
		}
	},
	biggest: {
		streak: {
			wins: {
				type: Number,
				default: null
			},
			draws: {
				type: Number,
				default: null
			},
			loses: {
				type: Number,
				default: null
			},
		},
		wins: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			},
		},
		loses: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			},
		},
		goals: {
			for: {
				home: {
					type: Number,
					default: null
				},
				away: {
					type: Number,
					default: null
				},
			},
			against: {
				home: {
					type: Number,
					default: null
				},
				away: {
					type: Number,
					default: null
				},
			}
		}
	},
	clean_sheet: {
		home: {
			type: Number,
			default: null
		},
		away: {
			type: Number,
			default: null
		},
		total: {
			type: Number,
			default: null
		}
	},
	failed_to_score: {
		home: {
			type: Number,
			default: null
		},
		away: {
			type: Number,
			default: null
		},
		total: {
			type: Number,
			default: null
		}
	},
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	league_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	season_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_team_statistics'
});

const TeamStatistics = mongoose.model('TeamStatistics', modelSchema);

module.exports = TeamStatistics;
