"""empty message

Revision ID: 232ee97f591b
Revises: 10f3cda0c765
Create Date: 2022-04-02 09:50:13.141238

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '232ee97f591b'
down_revision = '10f3cda0c765'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('subject', sa.Column('stripe_id', sa.String(), nullable=False))
    op.create_unique_constraint(None, 'subject', ['stripe_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'subject', type_='unique')
    op.drop_column('subject', 'stripe_id')
    # ### end Alembic commands ###
