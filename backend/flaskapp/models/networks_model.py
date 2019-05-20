from flaskapp import db
from flaskapp.models import BaseModel, TableNames, RelationShip


class NetworkModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_NETWORKS

    # The table columns.
    id = db.Column(db.String(5), primary_key=True)
    description = db.Column(db.String(500), nullable=True)
    stations = db.relationship(RelationShip.STATIONS, backref="network",
                               cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "NetworkModel(id={})".format(self.id)
