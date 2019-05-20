from datetime import date

from flaskapp import db
from flaskapp.models import BaseModel, TableNames, RelationShip


class StationModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_STATIONS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    network_id = db.Column(db.String(5), db.ForeignKey(TableNames.T_NETWORKS + ".id"), nullable=False)
    name = db.Column(db.String(16), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    creation_date: date = db.Column(db.Date, nullable=False)
    removal_date: date = db.Column(db.Date, nullable=True)
    public_data = db.Column(db.Boolean, nullable=False)
    site = db.Column(db.String(100), nullable=True)
    geology = db.Column(db.String(50), nullable=True)
    province = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    experiments = db.relationship(RelationShip.EXPERIMENTS, backref="station",
                                  cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "StationModel(id={},network_id={},name={}, latitude={}, longitude={})"\
            .format(self.id, self.network_id, self.name, self.latitude, self.longitude)


class ExperimentModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_EXPERIMENTS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    station_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_STATIONS + ".id"), nullable=False)
    sample_rate = db.Column(db.Integer, nullable=False)
    start_time: date = db.Column(db.Date, nullable=False)
    stop_time: date = db.Column(db.Date, nullable=True)
    equipments = db.relationship(RelationShip.EXPERIMENT_EQUIPMENTS, backref="experiment",
                                 cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "ExperimentModel(id={},station_id={},sample_rate={}, start_time={}, stop_time={})"\
            .format(self.id, self.station_id, self.sample_rate, self.start_time, self.stop_time)


class ExperimentEquipmentsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_EXPERIMENTS_EQUIPMENTS

    # The table columns.
    experiment_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_EXPERIMENTS + ".id"), primary_key=True)
    equipment_id = db.Column(db.String(16), db.ForeignKey(TableNames.S_EQUIPMENTS + ".id"), primary_key=True)

    def __repr__(self):
        return "ExperimentEquipmentsModel(experiment_id={},equipment_id={})"\
            .format(self.experiment_id, self.equipment_id)
