"""empty message

Revision ID: 075785153e11
Revises: 71c2878d34f8
Create Date: 2022-04-22 19:14:25.613732

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '075785153e11'
down_revision = '71c2878d34f8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('user_stripe_id_key', 'user', type_='unique')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('user_stripe_id_key', 'user', ['stripe_id'])
    # ### end Alembic commands ###
