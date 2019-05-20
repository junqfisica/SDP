from flaskapp import db
from flaskapp.models import BaseModel, TableNames, RelationShip


class EquipmentsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_EQUIPMENTS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    tag = db.Column(db.String(50), db.ForeignKey(TableNames.S_EQUIPMENT_TAGS + ".tag_id"), nullable=False)
    description = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return "EquipmentsModel(id={},tag={})".format(self.id, self.tag)

    @property
    def tag_description(self):
        """
        Gets the description for this equipment tag.

        :return: The description of the equipment tag.
        """
        # info comes from backref="info"
        return self.info.description


class EquipmentTagsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_EQUIPMENT_TAGS

    # The table columns.
    tag_id = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(500), nullable=True)
    equipments = db.relationship(RelationShip.EQUIPMENTS, backref="info",
                                 cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "EquipmentTagsModel(tag_id={})".format(self.tag_id)

    def to_dict(self):
        """
        Convert EquipmentTagsModel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add additional values for the dictionary.
        dict_representation["equipments"] = [eq.to_dict() for eq in self.equipments]

        return dict_representation

