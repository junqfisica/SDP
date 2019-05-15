from flaskapp import db
from flaskapp.models import BaseModel, TableNames


class NetworkModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_NETWORKS

    # The table columns.
    network_id = db.Column(db.String(16), primary_key=True)
    label = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return "NetworkModel(network_id={})".format(self.network_id)
